//login.js
var appData = require("../../data/post-data.js");
Page({
  data: {
    showLoading: false,
    getCode: '获取验证码',
    phoneNum: '',
    phoneError: '',
    CodeError: '',
  },
  validateMobile: function(obj) {
    var that = this;
    if (obj == "" || obj == "undefind") {
      that.setData({
        phoneError: "手机号码不能为空，请填写"
      });
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(obj)) {
      that.setData({
        phoneError: "手机号码格式不正确，请重新输入"
      });
      return false;
    }
    that.setData({
      phoneError: ""
    });
    return true;
  },
  validateCode: function(obj) {
    var that = this;
    if (obj == "") {
      that.setData({
        CodeError: "请填写手机验证码"
      });
      return false;
    } else if (obj.length < 4) {
      that.setData({
        CodeError: "验证码格式有误， 请输入4位验证码"
      });
      return false;
    }
    that.setData({
      CodeError: ""
    });
    return true;
  },
  changePhone: function(e) {
    this.setData({
      phoneNum: e.detail.value
    });
    this.validateMobile(e.detail.value);
  },
  changeCode: function(e) {
    this.validateCode(e.detail.value);
  },
  getCode: function(e) {
    var that = this;
    var second = 60;
    var timeF = null;
    setTimeout(function() {
      var phoneNum = that.data.phoneNum;
      if (that.validateMobile(phoneNum)) {
        timeF = setInterval(function() {
          second -= 1;
          if (second > 0) {
            that.setData({
              getCode: second + '秒后重新发送',
              smallText: true
            });
          } else {
            clearInterval(timeF);
            that.setData({
              getCode: '重新获取',
              smallText: false
            });
          }
        }, 1000);
        wx.request({
          //获取验证码
          url: appData.getDate.get_verification_code,
          data: {
            "cellphone": phoneNum,
            "type": "login"
          },
          method: 'POST',
          header: {
            'content-type': appData.getDate.contentType
          },
          success: function(res) {
            that.setData({
              CodeError: res.data.err_msg,
            });
          }
        });
      }
    }, 100);
  },
  validateRegisterForm: function(obj) {
    var that = this;
    that.validateMobile(obj.cellphone);
    that.validateCode(obj.verifycode);
    if (that.validateMobile(obj.cellphone) && that.validateCode(obj.verifycode)) {
      return true;
    } else {
      return false;
    }
  },
  formSubmit: function(e) {
    var that = this;
    var formData = e.detail.value;
    var unionId = wx.getStorageSync('unionId');
    var allergyRisk = wx.getStorageSync('allergyRisk');
    formData['unionid'] = wx.getStorageSync('unionId');
    if (that.validateRegisterForm(formData)) {
      that.setData({
        showLoading: true
      });
      wx.request({
        //上线接口地址要是https测试可以使用http接口方式
        url: appData.getDate.loginUrl,
        data: formData,
        method: 'POST',
        header: {
          'content-type': appData.getDate.contentType
        },
        success: function(res) {
          that.setData({
            showLoading: false
          });
          if (res.data.err_code == "200") {
            wx.setStorageSync('isLogin', '1');
            wx.request({
              url: appData.getDate.joinA,
              method: 'POST',
              data: {
                "join_member": wx.getStorageSync('joinMember'),
                "union_id": unionId,
                "allergy_risk": allergyRisk
              },
              header: {
                'content-type': appData.getDate.contentType
              },
              success: function(res) {
                console.log('success');
              }
            });
            wx.navigateBack({
              delta: 1
            });
          } else {
            that.setData({
              CodeError: res.data.err_msg,
            });
          }
        }
      });
    }
  },
  onLoad: function() {

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