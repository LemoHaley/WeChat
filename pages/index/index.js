//index.js
var appData = require("../../data/post-data.js");
const app = getApp();

Page({
  data: {
    motto: 'Welcome!',
    showLoading: true,
    showButton: false
  },
  onLoad: function() {
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          wx.request({
            url: appData.getDate.unionIdUrl, //自己的服务接口地址
            method: 'post',
            header: {
              'content-type': appData.getDate.contentType
            },
            data: { jscode: code },
            success: function(res) {
              //解密成功后 获取自己服务器返回的结果
              that.setData({
                showLoading: false
              });
              if (res.data.unionid) {
                wx.setStorageSync('unionId', res.data.unionid);
                wx.setStorageSync('isLogin', res.data.login);
              }
              wx.redirectTo({
                url: '../entrance/entrance'
              });
            },
            fail: function() {
              console.log('系统错误')
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }
})