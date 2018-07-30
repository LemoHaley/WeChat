//webview.js
var appData = require("../../data/post-data.js");
Page({
  data: {},
  onLoad: function(options) {
    var that = this;
    var urlLink = appData.getDate.mainUrl + JSON.parse(options.dataObj);
    console.log(urlLink);
    that.setData({
      urlLink: urlLink
    });
  }
});