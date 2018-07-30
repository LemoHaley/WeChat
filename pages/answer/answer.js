//answer.js
var WxParse = require('../wxParse/wxParse.js');
var appData = require("../../data/post-data.js");
Page({
  data: {
    questionIndex: 0,
    showPreviousQuestion: true,
    showSubmit: true,
    showSubmitActive: false,
    showQuestionlist: true,
    errorMes: false,
    loadingResult: true,
    answer: {},
    result: []
  },
  onLoad: function(options) {
    var that = this;
    var postData = wx.getStorageSync('questionTotal');
    var postDataList = postData.questions;
    that.setData({
      postList: postDataList
    });
    var obj = that.data.postList;
    for (let i = 0; i < obj.length; i++) {
      WxParse.wxParse('question' + i, 'html', obj[i].question, that);
      if (i === obj.length - 1) {
        WxParse.wxParseTemArray("questionTemArray", 'question', obj.length, that)
      }
    }
  },
  btnOpClick: function(e) {
    var that = this;
    that.data.answer[e.target.dataset.id] = e.target.dataset.as;
    var option = String(e.target.dataset.as);
    that.data.result[that.data.questionIndex] = {
      question: that.data.postList[that.data.questionIndex].question,
      option: that.data.postList[that.data.questionIndex].options[option]
    }
    var currentOption = e.currentTarget.dataset.as;
    that.data.postList[that.data.questionIndex]['currentItem'] = currentOption;
    that.setData({
      'currentItem': currentOption
    })

    this.setData({
      postList: that.data.postList
    });
    if (that.data.questionIndex == that.data.postList.length - 1) {
      that.setData({
        showSubmitActive: true,
      });
    }
    setTimeout(function() {
      if (that.data.questionIndex < that.data.postList.length - 1) {
        that.setData({
          questionIndex: that.data.questionIndex + 1,
        });
      };
      if (that.data.questionIndex == 0) {
        that.setData({
          showPreviousQuestion: true
        });
      } else {
        that.setData({
          showPreviousQuestion: false
        });
      }
      if (that.data.questionIndex == that.data.postList.length - 1) {
        that.setData({
          showSubmit: false
        });
      } else {
        that.setData({
          showSubmit: true
        });
      }
    }, 200);
  },
  previousQuestion: function(e) {
    var that = this;
    if (that.data.questionIndex == 1) {
      this.setData({
        showPreviousQuestion: true
      });
    }
    that.setData({
      showSubmit: true,
      errorMes: false
    });
    if (that.data.questionIndex > 0) {
      setTimeout(() => {
        this.setData({
          questionIndex: that.data.questionIndex - 1
        });
      }, 300);
    }
  },
  formSubmit: function(e) {
    var that = this;
    var formAnswer1 = wx.getStorageSync('formAnswer1');
    var formAnswer2 = this.data.answer;
    var num1 = Object.getOwnPropertyNames(formAnswer2).length;
    var num2 = that.data.postList.length;
    if (num1 == num2) {
      that.setData({
        showSubmit: !that.data.showSubmit,
        loadingResult: !that.data.loadingResult
      });
      wx.request({
        url: appData.getDate.formSubmit,
        method: 'POST',
        data: { answers: { formAnswer1, formAnswer2 } },
        header: {
          'content-type': appData.getDate.contentType
        },
        success: function(res) {
          wx.setStorageSync('questionResult', that.data.result);
          wx.setStorageSync('resultPage', res);
          wx.setStorageSync('allergyRisk', res.data.allergy_risk);
          wx.redirectTo({
            url: '../result/result'
          });
          // if (wx.getStorageSync('isLogin') == "1") {
          //   wx.redirectTo({
          //     url: '../result/result'
          //   });
          // } else {
          //   wx.redirectTo({
          //     url: '../register/register'
          //   });
          // }
          that.setData({
            showSubmit: !that.data.showSubmit,
            loadingResult: !that.data.loadingResult
          });
        }
      })
    } else {
      console.log('请完成答题');
      that.setData({
        errorMes: true,
      });
    }
  }
});