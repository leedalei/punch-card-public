const axios = require("axios");
const fs = require("fs");
const login = require("./serviceLogin");
const POSITION_ARR = require('./pos') 

let header = {
  Cookie: "抓包获取",
  "User-Agent": "okhttp/3.8.1",
  "X-HRX-Version": "v1.3.0",
  "X-APP-TYPE": "HRX",
  "X-HRX-App-Type": "Android",
  "X-HRX-Emplid": "抓包获取",
  "X-AUTH-CHANNEL": "HRX",
  "X-HRX-User-Type": 1,
  "Content-Type": "application/json;charset=utf-8",
  Host: "mobile.bluemoon.com.cn",
  Accept: "application/json",
  "X-HRX-SESSION": "",
};

// token写入本地
function setToken(data) {
  let dataString = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    fs.writeFile("token.json", dataString, "utf8", (err) => {
      if (err) return reject("写入文件失败");
      resolve();
    });
  });
}
// 获取本地token
function getToken() {
  return new Promise((resolve, reject) => {
    fs.readFile("token.json", "utf8", (err, buffer) => {
      if (err) return reject(err);
      let data = JSON.parse(buffer);
      resolve(data);
    });
  });
}

// 更新本地的token
async function getRefreshToken() {
  try {
    let tokenRes = await getToken();
    header["X-HRX-SESSION"] = tokenRes.accessToken;
    let { data } = await axios({
      method: "GET",
      url:
        "https://mobile.bluemoon.com.cn/hbp/hbp-userauth-mobile/auth/refreshToken.do",
      params: {
        refreshToken: tokenRes.refreshToken,
      },
      headers: header,
    });
    if (data.responseCode === "10001") {
      await setToken({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      });
      return true;
    } else {
      throw false;
    }
  } catch (err) {
    throw err;
  }
}
// 触发打卡
const umid = "工号md5 32位小写加密"; //工号md5 32位小写加密
async function punchRecord() {
  let tokenRes = await getToken();
  header["X-HRX-SESSION"] = tokenRes.accessToken;
  let data = POSITION_ARR[~~(Math.random()*6)]
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      headers: header,
      url:
        "https://mobile.bluemoon.com.cn/ess-api/absDmz/punchRecord/addPunchRecord.do",
      params: {
        umid,
      },
      data
    }).then((res) => {
      if (res.data.responseCode === "10001") {
        resolve(res.data);
      } else {
        reject(res.data.responseMsg);
      }
    }).catch(err=>{
      reject('打卡失败：走了catch')
    });
  });
}

const autoPunchRecord = async (verifyCode) => {
  try {
    if(!!verifyCode){
      //有验证码优先登录
      const tokenRes = await login.login(verifyCode);
      console.log("登录成功");
      await setToken(tokenRes);
      return await punchRecord();
    }else{
      await getRefreshToken();
      // 刷新token成功直接打卡
      console.log("刷新token成功");
      return await punchRecord();
    }
  } catch (err) {
    throw err;
  }
};

const sendMessage = async ()=>{
  try{
    await login.getMessageCode();
  }catch(err){
    throw err
  }
}
module.exports = {
  autoPunchRecord,
  sendMessage
};
