const axios = require("axios");
// 公共部分，安卓是这样的，ios好像些许不同
const headers = {
  Accept: "application/json",
  "X-HRX-SESSION": "",
  "X-HRX-Version": "v1.3.0",
  "X-HRX-App-Type": "Android",
  "X-HRX-Emplid": "",
  "X-AUTH-CHANNEL": "HRX",
  "X-HRX-User-Type": "1",
  "X-APP-TYPE": "HRX",
};
const getMessageCode = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url:
        "https://mobile.bluemoon.com.cn/hbp/hbp-userauth-mobile/user/sendSmsV2.do",
      headers,
      data: {
        phone: "你的手机号",
        sendType: "0",
        tenantid: "抓包获取",
      },
    })
      .then((res) => {
        if (res.data.responseCode === "10001") {
          resolve("短信发送成功");
        }else{
          reject("短信发送失败:" + res.data.responseMsg);
        }
      })
      .catch((err) => {
        reject("短信发送失败:走了catch" );
      });
  });
};

// 入参 验证码
const login = (validateCode) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url:
        "https://mobile.bluemoon.com.cn/hbp/hbp-userauth-mobile/user/smsLoginV2.do",
      headers,
      //这里ios的入参好像也有些许不同，具体内容以抓包的数据为准
      data: {
        appId: "app_pa_hrm_100005",
        appName: "智慧人事",
        appVersion: "v1.3.0",
        aresContent: {
          blackBox:
            "抓包获取",
          ipAddress: "抓包获取",
          loginType: 2,
          scenarioId: "02",
        },
        deviceID: "抓包获取",
        ip: "抓包获取",
        osType: "a",
        phone: "你的手机",
        systemVersion: "28",
        tenantid: "抓包获取",
        validateCode,
      },
    })
      .then((res) => {
        if (res.data.responseCode === "10001") {
          resolve({
            accessToken:res.data.data.accessToken,
            refreshToken:res.data.data.refreshToken
          });
        }else{
          reject("登陆失败:"+res.data.responseMsg);
        }
      })
      .catch(() => {
        reject("登陆失败：走了catch");
      });
  });
};

module.exports = {
  login,
  getMessageCode
}