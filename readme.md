> webpack构建后通过webhook自动发消息给企业微信群或者钉钉群  

> 解决jenkins等自动化构建工具构建结束时没有反馈

# HOW TO USE

## INSTALL
npm install webpack-robot-webcom-dingtalk-build-info-plugin -S

## EXAMPLE
```
EXAMPLE:
    const RobotBuildInfo = require('webpack-robot-webcom-dingtalk-build-info-plugin');
    plugins:[
        ...,
      // new RobotBuildInfo({robot: 'wecom', infoList: [{ ip: 'XXX.16.1.XXX', key: '70a2b2f9-4b11-4cb5-9ba7-050777555XXX', usr: ['1392099XXXX', '@all']}] })
      new RobotBuildInfo({ robot: 'dingtalk', infoList: [{ ip: 'XXX.16.1.XXX', key: '4cf8e6a7ad3f59788c4d730b581a0df224b33357558f50565c0a470855d23XXX', usr: ['1392099XXXX', '@all'] }] })
     ]
```
----------
##Plugin Param：

|  参数   | 类型  | 必填  | 说明  |
|  ----  | ----  | ---- |---- |
| robot  | string | 是 | 机器人类型：'wecom'企业微信 'dingtalk'钉钉 |
| infoList  | array | 是 |可配置多个群通知 |
| ip  | string | 是 |指定构建的ip地址 |
| key  | string | 是 |robot的webhook中的key值 |
| usr  | array | 是 |通知的手机号列表 |
----------
##特殊说明：
######
ip：指定构建的ip地址才会启动robot，通常设置为生产模式线上构建的物理地址
######
key：企业微信群or钉钉群机器人robot的webhook中的key值，key值具体获取方式请移步
>1.[钉钉自定义机器人接入](https://developers.dingtalk.com/document/app/custom-robot-access?spm=ding_open_doc.document.0.0.6d9d28e1MFaD4s#topic-2026027)  

>2.[企业微信自定义机器人接入](https://work.weixin.qq.com/help?person_id=1&doc_id=13376) 


######
usr: 通知的手机号列表，提醒手机号对应的群成员们(@某个成员)，@all表示提醒所有人

（钉钉@all状态和手机号通知互斥，配置@all后不会再@配置的群员）


######
钉钉添加机器人有三种安全设置，本插件不支持加签方式，自定义关键词方式配置关键词可从如下数组中选择['构建','时间','IP','环境','账户','开始','结束']
