---
layout: post
title: iOS Continuous Integration with fastlane
tags:
  - iOS
  - CI/CD
  - automation
  - fastlane
  - deployment

comments: true
---



# Introduction
Continuous integration is a "configure once, benefit long-term" task. But many small companies don't have it. Previously, configuring it for Windows development felt simpler. This time configuring it for iOS, I felt there were quite a few steps. I've organized it here to share with everyone. Please correct any mistakes.

This article mainly uses fastlane to configure iOS continuous integration, automatically compiling and packaging multiple versions.

I recently switched to iOS development, and the primary task was to use Jenkins (a sibling of Hudson) to configure continuous integration for iOS projects.
After searching various resources, I organized the following keywords.
<!-- more -->

1. Jenkins setup.
1. Use tools provided by fastlane to modify project configuration.
1. Use gym or ipa tools to compile the project.

# Goals

1. Configure a computer to automatically fetch code and regularly package the following versions of ipa files.
  - Internal test version: ipa file signed with a standard developer's Developer certificate.
  - Public test version: ipa file signed with an enterprise account's Distribute InHouse certificate.
  - AppStore version: ipa file signed with a standard developer's AppStore certificate.
  - Channel version: Internal test version, but with a channel identifier added to Info.plist for each channel <DEL>(because channels like fir.im will re-sign the ipa with their own certificate)</DEL>
PS: Added on November 24, 2015, fir.im does not re-sign ipa.


2. Keep dSYM debug symbol files for each version.


# Source Code
[https://github.com/everettjf/Yolo/tree/master/FastlaneBasicDemo4iOS](https://github.com/everettjf/Yolo/tree/master/FastlaneBasicDemo4iOS)



# Installation
Both fastlane and shenzhen need to be installed via gem. Change the gem source to `Taobao source`.

1- Install fastlane
  
~~~
sudo gem install fastlane
~~~
  
  - fastlane is written in Ruby and installed via gem.
  - [https://fastlane.tools/](https://fastlane.tools/)

2- Install shenzhen

~~~
  sudo gem install shenzhen
~~~

  - If you only use the gym command and not the ipa command, you don't need to install this.
  - [https://github.com/nomad/shenzhen](https://github.com/nomad/shenzhen)

# Example Steps
1- In the same directory as the xcodeproj file, execute

~~~
fastlane init
~~~

fastlane is very powerful, it can even automatically take screenshots and submit to App Store review, but I only use the simplest packaging functionality.
There will be a series of questions.

~~~
* Do you want to get started...? y
* Do you have everything commited... ? y
* App Identifier (com.krausefx.app): com.everettjf.fastlanedemo
* Your Apple ID (fastlane@krausefx.com): xxxxxxxx@xxxx.com
* ... updates to the App Store or Apple TestFlight? (y/n) n
* Do you want to setup 'snapshot'... n
* Do you want to use 'sigh'... n (Whether to automatically download provisioning files)
* The scheme name of your app: fastlanetest (If there's only one project, you can also skip this)
~~~

  One step above requires entering an Apple ID because fastlane (one of its tools is sigh, the letter H) will automatically download corresponding provisioning files. Automatically downloading provisioning files is quite convenient for Developer certificates that frequently add test devices. However, for this example, we won't automatically download.

  After execution, a fastlane folder will be generated in the project directory.

~~~
drwxr-xr-x   5 everettjf  staff   170B Sep  8 22:32 fastlane
drwxr-xr-x  10 everettjf  staff   340B Sep  8 22:00 fastlanedemo
drwxr-xr-x   5 everettjf  staff   170B Sep  8 22:38 fastlanedemo.xcodeproj
drwxr-xr-x   4 everettjf  staff   136B Sep  8 22:00 fastlanedemoTests
~~~
  
  We need to modify two configuration files in the fastlane folder: Appfile and Fastfile. (They're actually Ruby code)

2- Modify Appfile

~~~ ruby
app_identifier "com.everettjf.fastlanedemo"
apple_id "aaa@aaa.com"

for_lane :inhouse do
  app_identifier "com.everettjf.fastlanedemoqiye"
  apple_id "bbb@bbb.com"
end
~~~


  Enterprise InHouse version has different app_identifier and apple_id from AppStore.
  Here for_lane is to set separate information for the :inhouse version defined later in Fastfile.

3- Modify Fastfile

  This file needs to contain compilation and packaging code for each version (Developer version, AppStore version, InHouse version, multiple channel versions),
  Each version needs to go through the following steps:
  - Modify version number and build number (change to externally passed version, e.g., 1.0.0 and 100)
  - 
~~~ruby
def prepare_version(options)
    #say 'version number:'
    #say options[:version]
    increment_version_number(
        version_number: options[:version],
        xcodeproj: PROJECT_FILE_PATH,
    )
    #say 'build number:'
    #say options[:build]
    increment_build_number(
        build_number: options[:build],
        xcodeproj: PROJECT_FILE_PATH,
    )
end
~~~

  - Modify app identifier (that's the bundle id, e.g., com.everettjf.fastlanedemo)

~~~ruby
def update_app_identifier(app_id)
    update_info_plist(
        xcodeproj:PROJECT_FILE_PATH ,
        app_identifier:app_id,
        plist_path:"#{PLIST_FILE_PATH}"
    )
    update_info_plist(
        xcodeproj:PROJECT_FILE_PATH ,
        app_identifier:app_id,
        plist_path:"#{UNITTEST_PLIST_FILE_PATH}"
    )
end
~~~

  - Modify signing configuration, configure corresponding provision file

~~~ruby
def update_provision(typePrefix)
  update_project_provisioning(
      xcodeproj:PROJECT_FILE_PATH ,
      profile:"./fastlane/provision/#{typePrefix}.mobileprovision",
  )
end
~~~

  - Channel version modifies corresponding string in Info.plist file

~~~ruby
def set_info_plist_value(path,key,value)
  sh "/usr/libexec/PlistBuddy -c \"set :#{key} #{value}\" #{path}"
end
def set_channel_id(channelId)
    set_info_plist_value(
        "./../fastlanedemo/#{PLIST_FILE_PATH}",
        'ChannelID',
        "#{channelId}"
    )
end
~~~

  - Compile and package as ipa

  This step uses the shenzhen tool, but you can also use gym recommended by fastlane.

~~~ruby
def generate_ipa(typePrefix,options)
  #say 'generate ipa'
  fullVersion = options[:version] + '.' + options[:build]
  channelId = options[:channel_id]
  ipa(
      configuration:"Release",
      scheme:"#{SCHEME_NAME}",
      destination:"./build",
      ipa:"#{APP_NAME}_#{fullVersion}_#{typePrefix}.ipa",
      archive:false
  )
  sh "mv ./../build/#{APP_NAME}.app.dSYM.zip ./../build/#{APP_NAME}_#{fullVersion}_#{typePrefix}.app.dSYM.zip"
end
~~~

4- Write shell script

~~~
#!/bin/sh

#
# usage:
# > sh build.sh 1.0.0 200
#

versionNumber=$1 # 1.0.0
buildNumber=$2 # 2000

rm -rf build

basicLanes="AdHoc AppStore Develop InHouse"
for laneName in $basicLanes
do
    fastlane $laneName version:$versionNumber build:$buildNumber
done

channelIds="fir 91"
for channelId in $channelIds
do
    fastlane Channel version:$versionNumber build:$buildNumber channel_id:$channelId
done
~~~


~~~
sh build.sh 1.0.0 100
~~~

  We pass in the main version number and an auto-incrementing id (usually Jenkins's build number).

# Configure Jenkins
With a one-click compilation script, have Jenkins call build.sh after fetching code.

Installation

~~~
brew install jenkins
~~~

Configure code fetching, after fetching code call shell:

~~~
sh build.sh 1.0.0 ${BUILD_NUMBER}
~~~


# Apple Developer Certificate Configuration
Assume we have two developer accounts, one is a standard developer account ($99, individual or company), and one is an enterprise account ($299).
- Standard developer account: aaa@aaa.com

~~~
Add com.everettjf.fastlanedemo to Identifiers
Add one iOS Distribution (AdHoc and AppStore) and iOS Development to Provisioning Profiles
~~~

- Enterprise account: bbb@bbb.com

~~~
Add com.everettjf.fastlanedemoqiye to Identifiers
Add one iOS Distribution (AdInHouse) to Provisioning Profiles
~~~

# Related Documentation

- fastlane: <https://github.com/KrauseFx/fastlane/tree/master/docs>
- shenzhen : <https://github.com/nomad/shenzhen>

# Other Approaches
1. Jenkins xcode plugin: Jenkins has an xcode plugin, there are some articles online, but I haven't used it. Not sure if it can dynamically change certificates.
2. Compile once, sign multiple times: Before using fastlane, I saw that fastlane provided a set of tools, so I used gym to first compile an ipa signed with a Developer certificate, then signed it with other certificates separately.

# Important Addition
- The Xcode on the machine where Jenkins is installed needs to import developer accounts (account information with private keys, exported from Xcode on the computer where the certificate was first created)


# Addition on October 16, 2015
Event: After Xcode 7 release

CFBundleIdentifier is recommended to use $(PRODUCT_BUNDLE_IDENTIFIER) instead of the original $(BUNDLE_IDENTIFIER). $(BUNDLE_IDENTIFIER) in Info.plist files will also automatically point to $(PRODUCT_BUNDLE_IDENTIFIER).

Therefore, fastlane's action `update_info_list` cannot update $(PRODUCT_BUNDLE_IDENTIFIER) in the project file.
This also causes the original script to fail to modify the bundle identifier in its new location when packaging enterprise versions. Current temporary workaround:

~~~
sh "sed -i '' 's/com.xxx.xxx/com.xxx.yyy/g' path/project.pbxproj"
~~~

I submitted an issue to fastlane for this: <https://github.com/KrauseFx/fastlane/issues/684>

fastlane will provide an updated method soon.
Thanks to fastlane developers squarefrog and KrauseFx.
