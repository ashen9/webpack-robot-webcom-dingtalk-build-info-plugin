const axios = require("axios")
/*
var jenkins = jenkinsapi.init("http://deployadmin:11eeb16d62c66649a580b7e05eb8cbc3b5@10.106.11.64:83/jenkins");

jenkins.all_jobs({depth: 1}, function(err, data) {
    if (err){ return console.log(err); }
    data.forEach(d => {
        console.log(d)
    })
});
*/

/*
jenkins.last_build_info('test_iot_frontend_my-iot-platform_deploy', {depth: 1}, function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});
*/
class robot_build_info {
  constructor(options) {
    this.options = options.infoList;
    this.robot = options.robot;
  }
  // 获取本机IP及用户信息
  getUserInfo() {
    const os = require('os')
    const interfaces = os.networkInterfaces()
    const username = os.userInfo().username
    for (var devName in interfaces) {
      var iface = interfaces[devName]
      for (var i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          // console.log(alias.address);
          return { username, address: alias.address }
        }
      }
    }
  }
  // 时间转换
  GMTToStr(time) {
    const date = new Date(time)
    const Str = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds()
    return Str
  }

  apply(compiler) {
    compiler.hooks.done.tap('WeComRobotBuildInfo', (compilation, callback) => {
      // do something when webpack compilation done
      const { username, address } = this.getUserInfo();
      const robotAction = ({key,ip,usr}) => {
        if(ip && (ip === address)) {
          let webhookPrefix = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=`;
          const content = `${process.env.VUE_APP_BASE_API.includes('dev') ? '测试' : '生产'}环境构建${compilation.hasErrors() ? '错误' : '成功'}!          
                    构建者IP:${address},
                    构建者系统账户:${username},
                    构建开始时间:${this.GMTToStr(compilation.startTime)},
                    构建结束时间:${this.GMTToStr(compilation.endTime)},
                    构建版本号：${process.env.VUE_APP_VERSION || null}`;
          let message = {
            'msgtype': 'text',
            'text': {
              'content': content,
              // "mentioned_list":["wangqing","@all"],
              'mentioned_mobile_list': [...usr]
            }
          };
          if (this.robot === 'dingtalk') {
            // console.log(usr.includes('@all'), usr.filter(item => item !== '@all'));
            webhookPrefix = `https://oapi.dingtalk.com/robot/send?access_token=`;
            message = {
              "msgtype": "text",
              "text": {
                "content": content
              },
              "at": {
                "isAtAll": usr.includes('@all'),
                "atMobiles":  usr.filter(item => item !== '@all')
              }
            }
          }

          axios.post(`${webhookPrefix}${key}`, message
          ).then(response => {
            console.info("机器人webhook成功状态：");
            console.info(response.data);
          }).catch(error => {
            console.error("机器人webhook失败状态：");
            console.error(error);
          })
        }
      }
      if (Array.isArray(this.options)) {
        this.options.forEach(option => {
          robotAction(option);
        })
      }
      /* if (Object.prototype.toString.call(this.options) === '[object Object]') {
        robotAction(this.options);
      }*/
    })
  }
}


module.exports = robot_build_info;
