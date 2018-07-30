//register.js
var appData = require("../../data/post-data.js");
var util = require('../../utils/util.js');
Page({
  data: {
    showLoading: false,
    showContent: true,
    years: '年',
    month: '月',
    day: '日',
    secYears: '年',
    secMonth: '月',
    secDay: '日',
    getCode: '获取验证码',
    phoneNum: '',
    phoneError: '',
    CodeError: '',
    nameError: '',
    agreeError: '',
    checkError1: '',
    checkError2: '',
    birthError: '',
    checkVal: '1',
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
  validateName: function(obj) {
    var that = this;
    if (obj.length == 0) {
      that.setData({
        nameError: "名字不能为空，请填写"
      });
      return false;
    }
    if (!obj.match(/^[\u4E00-\u9FA5A-Za-z]{1,50}$/)) {
      that.setData({
        nameError: "名字格式有误，请重新填写"
      });
      return false;
    }

    that.setData({
      nameError: ""
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
  validateBirth: function(obj) {
    var that = this;
    if (obj == "" || obj == null) {
      that.setData({
        birthError: "预产期不能为空，请填写"
      });
      return false;
    }
    that.setData({
      birthError: ""
    });
    if (that.getTime2Time(that.data.nowDate, obj) <= -550) {
      that.setData({
        birthError: "宝宝月龄过小不符合要求，请重新选择预产期"
      });
      return false;
    }
    return true;
  },
  validateBirth2: function(obj) {
    var that = this;
    that.setData({
      birthError2: ""
    });
    if (that.getTime2Time(obj, that.data.birth1) <= 270) {
      that.setData({
        birthError2: "一胎跟二胎间隔时间应大于270天，请重新填写"
      });
      return false;
    }
    if (that.getTime2Time(that.data.nowDate, obj) <= -550) {
      that.setData({
        birthError2: "宝宝月龄过小不符合要求，请重新选择预产期"
      });
      return false;
    }
    return true;
  },
  validateCheck1: function(obj) {
    var that = this;
    if (obj.length == "") {
      that.setData({
        checkError1: "请选择1-3个选项"
      });
      return false;
    }
    that.setData({
      checkError1: ""
    });
    return true;
  },
  validateCheck2: function(obj) {
    var that = this;
    if (obj.length == "") {
      that.setData({
        checkError2: "此项不能为空，请重新输入"
      });
      return false;
    }
    that.setData({
      checkError2: ""
    });
    return true;
  },
  validateAgree: function(obj) {
    var that = this;
    if (obj.length == "") {
      that.setData({
        agreeError: "您必须同意《会员服务条款》后，才能提交注册"
      });
      return false;
    }
    that.setData({
      agreeError: ""
    });
    return true;
  },
  getTime2Time: function($time1, $time2) {
    var time1 = arguments[0],
      time2 = arguments[1];
    time1 = Date.parse(time1) / 1000;
    time2 = Date.parse(time2) / 1000;
    var time_ = time1 - time2;
    return (time_ / (3600 * 24));
  },
  changeDate1: function(e) {
    var that = this;
    that.setData({
      years: e['detail'].value.split('-')[0],
      month: e['detail'].value.split('-')[1],
      day: e['detail'].value.split('-')[2],
      birthError: ""
    });
    var obj = that.data.years + '-' + that.data.month + '-' + that.data.day;
    that.setData({
      birth1: obj
    });
    that.validateBirth(obj);
  },
  changeDate2: function(e) {
    var that = this;
    that.setData({
      secYears: e['detail'].value.split('-')[0],
      secMonth: e['detail'].value.split('-')[1],
      secDay: e['detail'].value.split('-')[2]
    });
    var obj = that.data.secYears + '-' + that.data.secMonth + '-' + that.data.secDay;
    that.validateBirth2(obj);
  },
  changePhone: function(e) {
    var that = this;
    that.setData({
      phoneNum: e.detail.value
    });
    that.validateMobile(e.detail.value);
    if (that.validateMobile(e.detail.value)) {
      wx.request({
        url: appData.getDate.validatePhone + that.data.phoneNum,
        method: 'GET',
        success: function(res) {
          if (res.data.err_code == "100") {
            that.setData({
              phoneError: "您已注册过美赞臣A+妈妈会会员，请直接登录"
            });
          }
        }
      });
    }
  },
  changeName: function(e) {
    this.validateName(e.detail.value);
  },
  changeCode: function(e) {
    this.validateCode(e.detail.value);
  },
  checkQuestion: function(e) {
    var that = this;
    var items = that.data.itemOption1
    var values = e.detail.value;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = false;
      for (var j = 0; j < values.length; ++j) {
        if (values.length > 3) {
          values.pop(values[0]);
        }
        if (items[i].key == values[j]) {
          items[i].checked = true;
          break
        }
      }
    }
    that.setData({
      itemOption1: items
    });

    this.validateCheck1(e.detail.value);
  },
  seCheckQuestion: function(e) {
    var that = this;
    var items = that.data.itemOption3;
    var values = e.detail.value;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = false;
      for (var j = 0; j < values.length; ++j) {
        if (values.length > 3) {
          values.pop(values[0]);
        }
        if (items[i].key == values[j]) {
          items[i].checked = true;
          break
        }
      }
    }
    that.setData({
      itemOption3: items
    });
    this.validateCheck1(e.detail.value);
  },
  checkBrand: function(e) {
    var that = this;
    var items = that.data.itemOption2;
    var value = e.detail.value;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = false;
      if (items[i].key == value) {
        items[i].checked = true;
      }
    }
    that.setData({
      itemOption2: items
    });
    this.validateCheck2(e.detail.value);
  },
  checkRadio: function(e) {
    var that = this;
    var items = that.data.itemOption4;
    var value = e.detail.value;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = false;
      if (items[i].key == value) {
        items[i].checked = true;
      }
    }
    that.setData({
      itemOption4: items
    });
  },
  agreeCheck: function(e) {
    var that = this;
    if (that.data.checkVal == "") {
      that.setData({
        checkVal: '1'
      });
    } else {
      that.setData({
        checkVal: ''
      });
    }
    this.validateAgree(e.detail.value);
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
            "type": "register"
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
  clickShow: function() {
    var that = this;
    that.setData({
      showContent: !that.data.showContent
    });
  },
  closeInfor: function() {
    var that = this;
    that.setData({
      resError: ''
    });
  },
  onLoad: function() {
    var that = this;
    var regiserOption = wx.getStorageSync('registerOption');
    var time = util.formatTime(new Date());
    var beforeYear = parseInt(time.split('-')[0]) - 3 + '-01-01';
    var afterYear = parseInt(time.split('-')[0]) + 3 + '-12-31';
    that.setData({
      itemOption1: regiserOption.field_enroll_attention,
      itemOption2: regiserOption.field_enroll_intention,
      itemOption3: regiserOption.field_enroll_second_attention,
      itemOption4: regiserOption.field_enroll_second_intention,
      beforeYear: beforeYear,
      afterYear: afterYear,
      nowDate: time
    });
  },
  validateRegisterForm: function(obj) {
    var that = this;
    that.validateMobile(obj.cellphone);
    that.validateCode(obj.verifycode);
    that.validateName(obj.name);
    that.validateBirth(obj.babybirth);
    that.validateCheck1(obj.attention);
    that.validateCheck2(obj.intention);
    that.validateAgree(obj.agree);
    if (that.validateMobile(obj.cellphone) && that.validateCode(obj.verifycode) && that.validateName(obj.name) &&
      that.validateBirth(obj.babybirth) && that.validateCheck1(obj.attention) &&
      that.validateCheck2(obj.intention) && that.validateAgree(obj.agree)) {
      return true;
    } else {
      return false;
    }
    if (formData.secbabybirth != null) {
      that.validateBirth2(obj.secbabybirth);
    }
  },
  formSubmit: function(e) {
    var that = this;
    var formData = e.detail.value;
    var unionId = wx.getStorageSync('unionId');
    var allergyRisk = wx.getStorageSync('allergyRisk');
    formData['unionid'] = wx.getStorageSync('unionId');
    that.validateRegisterForm(formData);
    that.setData({
      birthError2: "",
      checkError3: "",
      checkError4: ""
    });
    var validate1 = function(formData) {
      if (formData.secAttention == "" && formData.secIntention == "" && formData.secbabybirth == null) {
        return true;
      }
      if (formData.secbabybirth != null) {
        that.validateBirth2(formData.secbabybirth);
        if (formData.secAttention != "" && formData.secIntention != "") {
          return true;
        }
      }
      if (formData.secbabybirth == null) {
        that.setData({
          birthError2: "预产期不能为空，请填写"
        });
      }
      if (formData.secAttention == "") {
        that.setData({
          checkError3: "请选择1-3个选项"
        });
      }
      if (formData.secIntention == "") {
        that.setData({
          checkError4: "此项不能为空，请重新输入"
        });
      }
      return false;
    }
    validate1(formData);

    if (that.validateRegisterForm(formData) && validate1(formData)) {
      that.setData({
        showLoading: true
      });
      wx.request({
        //上线接口地址要是https测试可以使用http接口方式
        url: appData.getDate.registerUrl,
        data: { user_data: formData },
        method: 'POST',
        header: {
          'content-type': appData.getDate.contentType
        },
        success: function(res) {
          that.setData({
            showLoading: false,
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
              resError: res.data.err_msg
            });
            wx.pageScrollTo({
              scrollTop: 0,
              duration: 400
            });
          }
        }
      });
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 400
      });
      that.setData({
        resError: '您的信息存在错误，请修改'
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