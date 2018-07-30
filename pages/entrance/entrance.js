//entrance.js
var appData = require("../../data/post-data.js");

Page({
  data: {
    showLoading: true
  },
  //弹出提示框 
  testNow: function() {
    wx.navigateTo({
      url: '../landing/landing'
    });
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: appData.getDate.getInfor,
      method: 'POST',
      header: {
        'content-type': appData.getDate.contentType
      },
      success: function(res) {
        if (res.data.message == "Success") {
          wx.setStorageSync('questionTotal', res.data.webform);
          wx.setStorageSync('resultImage', res.data.banners);
          wx.setStorageSync('registerOption', res.data.profile_options);
          that.setData({
            imgurl: appData.getDate.mainUrl + res.data.banners.entrance_banner.image,
            showLoading: !that.data.showLoading
          });
        }
      }
    });
    if (!wx.getStorageSync('unionId')) {
      that.setData({
        getInfor: true
      });
    }
  },
  userInfoHandler: function(e) {
    var that = this;
    if (e.detail.encryptedData) {
      that.setData({
        showLoading: true
      });
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
              data: {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                jscode: code
              },
              success: function(res) {
                //解密成功后 获取自己服务器返回的结果
                if (res.data.unionid) {
                  that.setData({
                    showLoading: false
                  });
                  wx.setStorageSync('unionId', res.data.unionid);
                  wx.setStorageSync('isLogin', res.data.login);
                  wx.redirectTo({
                    url: '../landing/landing'
                  });
                }
              },
              fail: function() {
                console.log('系统错误')
              }
            });
          }
        }
      });
    }
  },
  onReady: function() {
    // 页面渲染完成  
  },
  onShow: function() {
    // 页面显示  
  },
  onHide: function() {
    // 页面隐藏  
  },
  onUnload: function() {
    // 页面关闭  
  }
})