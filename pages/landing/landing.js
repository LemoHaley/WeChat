//landing.js
var WxParse = require('../wxParse/wxParse.js');
var dataList = require('../../data/post-data.js');
Page({
  data: {
    radioHidden: true,
    modalHidden: true,
    radioCheckVal1: 0,
    radioCheckVal2: 0
  },
  radioCheckedChange1: function(e) {
    this.setData({
      radioCheckVal1: e.detail.value
    })
  },
  radioCheckedChange2: function(e) {
    this.setData({
      radioCheckVal2: e.detail.value
    })
  },
  //弹出提示框 
  onLoad: function(options) {
    var that = this;
    var questionTotal = wx.getStorageSync('questionTotal');
    that.setData({
      question: questionTotal.background_research_questions
    });

    var question1 = that.data.question[0].question;
    WxParse.wxParse('question1', 'html', question1, that, 0);
    var question2 = that.data.question[1].question;
    WxParse.wxParse('question2', 'html', question2, that, 0);
    var question3 = that.data.question[2].question;
    WxParse.wxParse('question3', 'html', question3, that, 0);
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
  },
  closePopup: function() {
    this.setData({
      modalHidden: true
    })
  },
  formSubmit: function(e) {
    var that = this;
    var formData = e.detail.value;
    switch (formData.full_breast_milk_feed) {
      case '1':
        formData.full_breast_milk_feed = "full_breast_milk_feed_answer_1"
        break;
      case '2':
        formData.full_breast_milk_feed = "full_breast_milk_feed_answer_0"
        break;
      case '3':
        formData.full_breast_milk_feed = "non_full_breast_milk_feed_answer_1"
        break;
      case '4':
        formData.full_breast_milk_feed = "non_full_breast_milk_feed_answer_0"
        break;
    }
    switch (formData.family_allergy) {
      case '1':
        formData.family_allergy = "family_allergy_answer_1"
        break;
      case '2':
        formData.family_allergy = "family_allergy_answer_0"
        break;
    }
    if (e.detail.value.family_allergy == "" || e.detail.value.full_breast_milk_feed == "") {
      this.setData({
        modalHidden: false
      })
    } else {
      wx.setStorageSync('formAnswer1', formData);
      wx.navigateTo({
        url: '../answer/answer'
      });
    }
  }
})