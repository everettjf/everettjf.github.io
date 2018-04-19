---
layout: post
title: 使用fastlane实现iOS持续集成
categories: Skill
comments: true
---






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

