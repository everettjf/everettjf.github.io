---
layout: post
title: "iOS Continuous Integration with fastlane"
title_zh: "使用 fastlane 实现 iOS 持续集成"
lang_original: zh
categories: Skill
comments: true
---





# Introduction
Continuous integration is a "configure once, benefit long-term" piece of work. But many small companies don't have it. Configuring it back when I did Windows development felt simpler; configuring it for iOS this time, there seem to be quite a few steps. Organizing it here to share with everyone — please point out any mistakes promptly.

This article mainly uses fastlane to configure iOS continuous integration: automatically compiling and packaging out multiple versions.

I recently switched to iOS development, and the first task is to use Jenkins (you could say it's hudson's sibling) to configure continuous integration for the iOS project.
After searching all sorts of materials, I organized the following key points.
<!-- more -->

1. Setting up Jenkins.
1. Using the tools provided in fastlane to modify the project configuration.
1. The gym or ipa tool to compile the project.

# Goals

1. Configure a computer to automatically fetch the code, and periodically package out ipa files of the following versions.
  - Internal test version: an ipa file signed with a standard developer's Developer certificate.
  - Public test version: an ipa file signed with an enterprise account's Distribute InHouse certificate.
  - AppStore version: an ipa file signed with a standard developer's AppStore certificate.
  - Channel versions: the internal test version, but with each channel's identifier added to Info.plist <DEL>（因为渠道例如fir.im 会使用自己的证书重新签名ipa）</DEL>
PS: Added November 24, 2015 — fir.im does not re-sign the ipa.


2. Keep the dSYM debug symbol file for each version.


# Source Code
[https://github.com/everettjf/Yolo/tree/master/FastlaneBasicDemo4iOS](https://github.com/everettjf/Yolo/tree/master/FastlaneBasicDemo4iOS)



# Installation
Both fastlane and shenzhen need to be installed via gem; switch gem to a `Taobao source`.

1- Install fastlane
  
~~~
sudo gem install fastlane
~~~
  
  - fastlane is written in ruby, installed via gem.
  - [https://fastlane.tools/](https://fastlane.tools/)

2- Install shenzhen

~~~
  sudo gem install shenzhen
~~~

  - If you only use the gym command and not the ipa command, you can skip installing it.
  - [https://github.com/nomad/shenzhen](https://github.com/nomad/shenzhen)

# Example Steps
1- In the directory at the same level as the xcodeproj file, run

~~~
fastlane init
~~~

fastlane is very powerful — it can even take screenshots automatically and automatically submit to AppStore review, but I only use the simplest packaging feature.
There will be a series of questions here.

~~~
* Do you want to get started...? y
* Do you have everything commited... ? y
* App Identifier (com.krausefx.app): com.everettjf.fastlanedemo
* Your Apple ID (fastlane@krausefx.com): xxxxxxxx@xxxx.com
* ... updates to the App Store or Apple TestFlight? (y/n) n
* Do you want to setup 'snapshot'... n
* Do you want to use 'sigh'... n （是否自动下载provisioning文件）
* The scheme name of your app: fastlanetest （如果就一个工程，也可不输入）
~~~

  One step above asks you to enter your AppleID, because fastlane (one of its tools, sigh — that letter is H) will automatically download the corresponding provisioning file. Automatically downloading the provisioning file is quite convenient for a Developer certificate to which you frequently add test devices. However, for the demo we won't auto-download.

  After running this, a fastlane folder will be generated in the project directory.

~~~
drwxr-xr-x   5 everettjf  staff   170B Sep  8 22:32 fastlane
drwxr-xr-x  10 everettjf  staff   340B Sep  8 22:00 fastlanedemo
drwxr-xr-x   5 everettjf  staff   170B Sep  8 22:38 fastlanedemo.xcodeproj
drwxr-xr-x   4 everettjf  staff   136B Sep  8 22:00 fastlanedemoTests
~~~
  
  We need to modify two configuration files in the fastlane folder: Appfile and Fastfile. (They're actually ruby code.)

2- Modify Appfile

~~~ ruby
app_identifier "com.everettjf.fastlanedemo"
apple_id "aaa@aaa.com"

for_lane :inhouse do
  app_identifier "com.everettjf.fastlanedemoqiye"
  apple_id "bbb@bbb.com"
end
~~~


  The enterprise InHouse version and the AppStore version have different app_identifier and apple_id.
  Here for_lane sets separate info for the :inhouse lane defined later in the Fastfile.

3- Modify Fastfile

  In this file you write the compile and packaging code for each version (Developer version, AppStore version, InHouse version, multiple channel versions),
  each version goes through the following steps:
  - Modify the version number and build number (modify to the externally passed version, e.g.: 1.0.0 and 100)
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

  - Modify the app identifier (i.e. the bundle id, e.g.: com.everettjf.fastlanedemo)

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

  - Modify the signing configuration, configuring the corresponding provision file

~~~ruby
def update_provision(typePrefix)
  update_project_provisioning(
      xcodeproj:PROJECT_FILE_PATH ,
      profile:"./fastlane/provision/#{typePrefix}.mobileprovision",
  )
end
~~~

  - For channel versions, modify the corresponding string in the Info.plist file

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

  - Compile and package into an ipa

  This step uses the shenzhen tool; you could also use fastlane's recommended gym.

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

4- Write a shell script

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

  We pass in the major version number and an auto-incrementing id (usually the Jenkins build number).

# Configuring Jenkins
With a script that can compile in one click, we just let Jenkins call build.sh after fetching the code.

Install

~~~
brew install jenkins
~~~

Configure code fetching, and call the shell after fetching the code:

~~~
sh build.sh 1.0.0 ${BUILD_NUMBER}
~~~


# Apple Developer Certificate Configuration
Suppose we have two developer accounts, one standard developer account ($99, individual or company), and one enterprise account ($299).
- Standard developer account: aaa@aaa.com

~~~
Identifier中增加com.everettjf.fastlanedemo
Provisioning Profiles中增加一个 iOS Distribution(AdHoc 和 AppStore) 和 iOS Development
~~~

- Enterprise account: bbb@bbb.com

~~~
Identifier中增加com.everettjf.fastlanedemoqiye
Provisioning Profiles中增加一个 iOS Distribution(AdInHouse)
~~~

# Related Documentation

- fastlane: <https://github.com/KrauseFx/fastlane/tree/master/docs>
- shenzhen : <https://github.com/nomad/shenzhen>

# Other Approaches
1. Jenkins's xcode plugin: Jenkins has an xcode plugin, and there are some articles online, but I didn't use it. I'm not sure whether it can
dynamically swap certificates.
2. Compile once, sign multiple times: before using fastlane, when I saw that fastlane provided a toolset, I used gym to first compile
an ipa signed with the Developer certificate, then signed it with other certificates separately.

# Important Addendum
- The Xcode on the machine where Jenkins is installed must import the developer account (account info containing the private key, exported from the Xcode on the computer that first created the certificate)


# Addendum, October 16, 2015
Event: After Xcode 7 was released

CFBundleIdentifier is recommended to use $(PRODUCT_BUNDLE_IDENTIFIER) instead of the original $(BUNDLE_IDENTIFIER). The $(BUNDLE_IDENTIFIER) in the Info.plist file will also automatically point to $(PRODUCT_BUNDLE_IDENTIFIER).

Therefore, the action `update_info_list` provided by fastlane cannot update the $(PRODUCT_BUNDLE_IDENTIFIER) in the project file.
This causes the original script to be unable to modify the bundle identifier at its new location when packaging the enterprise version. The current temporary workaround:

~~~
sh "sed -i '' 's/com.xxx.xxx/com.xxx.yyy/g' path/project.pbxproj"
~~~

For this I filed an issue to fastlane: <https://github.com/KrauseFx/fastlane/issues/684>

fastlane will soon provide an updated way to do this.
Thanks to the fastlane developers squarefrog and KrauseFx.

<!--ZH-->





# 简介
持续集成是个“一次配置长期受益”的工作。但很多小公司都没有。以前在做Windows开发配置感觉简单一些，这次配置iOS的，感觉步骤还挺多。整理出来，分享给大家，不正确的地方请及时指正。

本文主要使用fastlane配置iOS的持续集成，自动编译、打包出多个版本。

最近转行iOS开发，首要任务是使用Jenkins（算是hudson的兄弟）配置iOS工程的持续集成。
查找各种资料后，整理出以下几个关键词。
<!-- more -->

1. jenkins搭建。
1. 使用fastlane中提供的工具修改工程配置。
1. gym 或 ipa 工具编译工程。

# 目标

1. 配置一台电脑自动获取代码，并定时打包出以下版本的ipa文件。
  - 内部测试版本：使用标准开发者的Developer证书签名的ipa文件。
  - 公开测试版本：使用企业账户的Distribute InHouse证书签名的ipa文件。
  - AppStore版本：使用标准开发者的AppStore证书签名的ipa文件。
  - 渠道版本：内部测试版本，但Info.plist中增加每个渠道的标示符<DEL>（因为渠道例如fir.im 会使用自己的证书重新签名ipa）</DEL>
PS: 2015年11月24日补充，fir.im 不会重新签名ipa。


2. 保留每个版本的dSYM调试符号文件。


# 源代码
[https://github.com/everettjf/Yolo/tree/master/FastlaneBasicDemo4iOS](https://github.com/everettjf/Yolo/tree/master/FastlaneBasicDemo4iOS)



# 安装
fastlane和shenzhen都需要gem安装，把gem更换为`淘宝源`。

1- 安装fastlane
  
~~~
sudo gem install fastlane
~~~
  
  - fastlane是ruby编写，使用gem安装。
  - [https://fastlane.tools/](https://fastlane.tools/)

2- 安装shenzhen

~~~
  sudo gem install shenzhen
~~~

  - 如果只使用了gym命令，而不使用ipa命令，可以不安装。
  - [https://github.com/nomad/shenzhen](https://github.com/nomad/shenzhen)

# 示例步骤
1- 在xcodeproj文件同级目录下，执行

~~~
fastlane init
~~~

fastlane 很强大，甚至能自动截图，自动提交AppStore审核，不过我只用最简单的打包功能。
这里会有一系列提问。

~~~
* Do you want to get started...? y
* Do you have everything commited... ? y
* App Identifier (com.krausefx.app): com.everettjf.fastlanedemo
* Your Apple ID (fastlane@krausefx.com): xxxxxxxx@xxxx.com
* ... updates to the App Store or Apple TestFlight? (y/n) n
* Do you want to setup 'snapshot'... n
* Do you want to use 'sigh'... n （是否自动下载provisioning文件）
* The scheme name of your app: fastlanetest （如果就一个工程，也可不输入）
~~~

  上面有一步要输入AppleID，是因为fastlane（的一个工具sigh，这个字母是H）会自动下载对应的provisioning文件。自动下载provisioning文件，对于经常增加测试设备的Developer证书挺方便。不过，示例就不自动下载了。

  执行完成后，会在工程目录下生成fastlane文件夹。

~~~
drwxr-xr-x   5 everettjf  staff   170B Sep  8 22:32 fastlane
drwxr-xr-x  10 everettjf  staff   340B Sep  8 22:00 fastlanedemo
drwxr-xr-x   5 everettjf  staff   170B Sep  8 22:38 fastlanedemo.xcodeproj
drwxr-xr-x   4 everettjf  staff   136B Sep  8 22:00 fastlanedemoTests
~~~
  
  我们需要修改fastlane文件夹的两个配置文件：Appfile和Fastfile。（实际是ruby代码）

2- 修改Appfile

~~~ ruby
app_identifier "com.everettjf.fastlanedemo"
apple_id "aaa@aaa.com"

for_lane :inhouse do
  app_identifier "com.everettjf.fastlanedemoqiye"
  apple_id "bbb@bbb.com"
end
~~~


  企业InHouse版本与AppStore的app_identifier、apple_id不同。
  这里for_lane 就是为后面Fastfile中定义的:inhouse版本设置单独的信息。

3- 修改Fastfile

  这个文件中要编写每个版本的编译和打包代码（Developer版本、AppStore版本、InHouse版本、多个渠道版本），
  每个版本要经过以下几个步骤：
  - 修改版本号和build号（修改为外部传入的版本，例如：1.0.0和100）
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

  - 修改app identifier（就是bundle id，例如：com.everettjf.fastlanedemo）

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

  - 修改签名的配置，配置对应的provision file

~~~ruby
def update_provision(typePrefix)
  update_project_provisioning(
      xcodeproj:PROJECT_FILE_PATH ,
      profile:"./fastlane/provision/#{typePrefix}.mobileprovision",
  )
end
~~~

  - 渠道版本修改Info.plist文件中对应的字符串

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

  - 编译打包为ipa

  这步使用了工具shenzhen，也可以使用fastlane推荐的gym。

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

4- 编写shell脚本

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

  我们传入主版本号和一个自增的id（一般是jenkins的build number）。

# 配置Jenkins
有了能一键编译的脚本，让Jenkins在获取代码后，调用build.sh就可以了。

安装

~~~
brew install jenkins
~~~

配置获取代码，获取代码后调用shell：

~~~
sh build.sh 1.0.0 ${BUILD_NUMBER}
~~~


# 苹果开发者证书配置
假设我们有两个开发者账号，一个是标准开发者账户（99刀，个人或公司），一个是企业账户（299刀）。
- 标准开发者账户：aaa@aaa.com

~~~
Identifier中增加com.everettjf.fastlanedemo
Provisioning Profiles中增加一个 iOS Distribution(AdHoc 和 AppStore) 和 iOS Development
~~~

- 企业账户：bbb@bbb.com

~~~
Identifier中增加com.everettjf.fastlanedemoqiye
Provisioning Profiles中增加一个 iOS Distribution(AdInHouse)
~~~

# 相关文档

- fastlane：<https://github.com/KrauseFx/fastlane/tree/master/docs>
- shenzhen : <https://github.com/nomad/shenzhen>

# 其他途径
1. Jenkins的xcode插件：Jenkins有个xcode插件，网上有些文章，不过自己没有使用。不知道能否
动态的更换证书。
2. 一次编译多次签名：在没有使用fastlane之前，看到fastlane提供了一套工具集，就使用gym先编译
一个Developer证书签名的ipa，之后使用其他证书分别签名。

# 重要补充
- 安装jenkins的机器上的Xcode要导入开发者账户（存在私钥的账户信息，通过首次创建证书的电脑上的Xcode导出）


# 2015年10月16日补充
事件：Xcode7发布后

CFBundleIdentifier 建议使用 $(PRODUCT_BUNDLE_IDENTIFIER) 代替原有的 $(BUNDLE_IDENTIFIER). Info.plist文件中的$(BUNDLE_IDENTIFIER)也会自动指向$(PRODUCT_BUNDLE_IDENTIFIER)。

因此，fastlane提供的action `update_info_list` 无法更新project文件中的$(PRODUCT_BUNDLE_IDENTIFIER) 。
也就导致在打包企业版本时原有脚本不能修改位于新位置的bundle identifier，目前临时解决办法：

~~~
sh "sed -i '' 's/com.xxx.xxx/com.xxx.yyy/g' path/project.pbxproj"
~~~

为此给fast lane提了一个issue : <https://github.com/KrauseFx/fastlane/issues/684>

fastlane很快会提供更新的方式。
感谢fastlane的开发者squarefrog和KrauseFx。
