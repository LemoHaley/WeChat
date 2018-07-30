//result.js
var WxParse = require('../wxParse/wxParse.js');
var appData = require("../../data/post-data.js");

Page({
  data: {
    showLoading: false,
    showContent: false,
    imgUrl: [],
    showPopup: false,
    showSecPopup: false,
    showThirdPopup: false,
    showEntrance: true
  },
  showContent: function(e) {
    var that = this;
    that.setData({
      showContent: !that.data.showContent,
    });
  },
  download: function(e) {
    var that = this;
    var urlLink = appData.getDate.mainUrl + that.data.pageData['result-pdf-url'];
    wx.downloadFile({
      url: urlLink,
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function(res) {
              console.log('打开文档成功')
            }
          });
        }
      }
    });
  },
  joinMember: function(num) {
    var that = this;
    var unionId = wx.getStorageSync('unionId');
    wx.request({
      url: appData.getDate.joinA,
      method: 'POST',
      data: {
        "join_member": num,
        "union_id": unionId,
        "allergy_risk": that.data.pageData.allergy_risk
      },
      header: {
        'content-type': appData.getDate.contentType
      },
      success: function(res) {
        console.log('ok');
      }
    });
  },
  confirm: function(e) {
    var that = this;
    var unionId = wx.getStorageSync('unionId');
    that.joinMember('1');
    that.setData({
      showPopup: false,
    });
  },
  secConfirm: function(e) {
    var that = this;
    var unionId = wx.getStorageSync('unionId');
    wx.setStorageSync('joinMember', '1');
    that.setData({
      showSecPopup: false,
    });
    wx.navigateTo({
      url: '../register/register'
    });
  },
  cancel: function(e) {
    var that = this;
    that.joinMember('0');
    that.setData({
      showPopup: false,
    });
  },
  secCancel: function(e) {
    var that = this;
    that.setData({
      showSecPopup: false
    });
  },
  thirdCancel: function() {
    var that = this;
    that.setData({
      showThirdPopup: false
    });
  },
  previewImage: function(e) {
    wx.previewImage({
      urls: this.data.imgurl4.split(',')
    })
  },
  goNext: function() {
    var that = this;
    var isLogin = wx.getStorageSync('isLogin');
    var isMember = '0';

    if (isLogin == "1") {
      if (isMember == '1') {
        that.setData({
          showThirdPopup: true
        });
      } else {
        that.setData({
          showPopup: true
        });
      }
    } else {
      that.setData({
        showSecPopup: true
      });
    }
    // if (isLogin == "0") {
    //   that.setData({
    //     showEntrance: false
    //   });
    //   if (allergyRisk == "1") {
    //     setTimeout(function() {
    //       that.setData({
    //         showPopup: true
    //       });
    //     }, 8000);
    //   } else {
    //     that.joinMember('0');
    //   }
    // } else {
    //   if (allergyRisk == "1") {
    //     setTimeout(function() {
    //       that.setData({
    //         showSecPopup: true
    //       });
    //     }, 8000);
    //   }
    // }
    // wx.navigateTo({
    //   url: '../register/register'
    // });
  },
  onLoad: function() {
    var that = this;
    var imageData = wx.getStorageSync('resultImage');
    var questionResult = wx.getStorageSync('questionResult');
    var pageData = wx.getStorageSync('resultPage').data;
    var allergyRisk = wx.getStorageSync('allergyRisk');
    var isLogin = wx.getStorageSync('isLogin');
    wx.setStorageSync('joinMember', '0');
    that.setData({
      imgurl1: appData.getDate.mainUrl + imageData.background_banner_1.image,
      imgurl2: appData.getDate.mainUrl + imageData.background_banner_2.image,
      imgurl3: appData.getDate.mainUrl + pageData['product-banner'],
      imgurl4: appData.getDate.mainUrl + pageData['article-banner'],
      imgurl5: appData.getDate.mainUrl + imageData.background_banner_join.image,
      questionResult: questionResult,
      pageData: pageData
    });
    if (isLogin == "1") {
      that.setData({
        showEntrance: false
      });
      if (allergyRisk == "1") {
        setTimeout(function() {
          that.setData({
            showPopup: true
          });
        }, 8000);
      } else {
        that.joinMember('0');
      }
    } else {
      if (allergyRisk == "1") {
        setTimeout(function() {
          that.setData({
            showSecPopup: true
          });
        }, 8000);
      }
    }
    var text1 = pageData['result-message'];
    WxParse.wxParse('text1', 'html', text1, that, 5);
    for (let i = 0; i < questionResult.length; i++) {
      WxParse.wxParse('reply' + i, 'html', questionResult[i].question, that);
      if (i === questionResult.length - 1) {
        WxParse.wxParseTemArray("replyTemArray", 'reply', questionResult.length, that)
      }
    }
    // var articles = pageData['articles'];
    // for (let i = 0; i < articles.length; i++) {
    //   var listImgUrl = appData.getDate.mainUrl + pageData['articles'][i]['image-url'];
    //   that.data.imgUrl.push(listImgUrl);
    //   that.setData({
    //     imgUrl: that.data.imgUrl
    //   });
    //   WxParse.wxParse('article' + i, 'html', articles[i].summary, that);
    //   if (i === articles.length - 1) {
    //     WxParse.wxParseTemArray("articleTemArray", 'article', articles.length, that)
    //   }
    // }    
  },

  onReady: function() {
    // 页面渲染完成  
  },
  onShow: function() {
    var that = this;
    var isLogin = wx.getStorageSync('isLogin');
    // if (isLogin == "1") {
    //   that.setData({
    //     showEntrance: false
    //   });
    // }
  },
  onHide: function() {
    // 页面隐藏  
  },
  onUnload: function() {
    // 页面关闭  
  }
})