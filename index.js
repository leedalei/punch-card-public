const express = require("express");
const bodyParser = require("body-parser");
const punch = require("./serviceRecord.js");
const app = express();
const fs = require("fs");

app.use(bodyParser.json());
app.get("/sendMsg", async (req, res) => {
  let statusTxt = "";
  try {
    await punch.sendMessage();
    statusTxt = "发送成功";
  } catch (err) {
    statusTxt = '发送失败';
    console.log('发送短信失败');
  }
  res.send(statusTxt);
});

app.post("/daka", async (req, res) => {
  let {code} = req.query
  let statusTxt = "";
  try {
    let res = await punch.autoPunchRecord(code);
    statusTxt = JSON.stringify(res);
  } catch (err) {
    statusTxt = '打卡失败';
    console.log("e====", err.responseMsg);
  }
  res.send(statusTxt);
});
app.get("/", (req,res) => {
  fs.readFile("./index.html", (err, data) => {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    if (err) {
      res.end("500");
    } else {
      res.end(data);
    }
  });
});

app.listen("7777", () => {
  console.log("app listen on 7777");
});
