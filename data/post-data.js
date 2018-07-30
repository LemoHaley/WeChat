var mainUrl = "xxx";
var apiKey = "?api-key=xxx";

var getDate = {
  "mainUrl": mainUrl,
  "unionIdUrl": mainUrl + "/wechatapp/cmatesttool/get_login_status" + apiKey,
  "getInfor": mainUrl + "/wechatapp/cmatesttool/get_resources" + apiKey,
  "formSubmit": mainUrl + "/wechatapp/cmatesttool/submit_result" + apiKey,
  "contentType": "application/json",
  "get_verification_code": mainUrl + "/wechatapp/cmatesttool/get_verification_code" + apiKey,
  "registerUrl": mainUrl + "/wechatapp/cmatesttool/register_user" + apiKey,
  "loginUrl": mainUrl + "/wechatapp/cmatesttool/login_user" + apiKey,
  "validatePhone": mainUrl + "/validate-user-exist/",
  "joinA": mainUrl + "/wechatapp/cmatesttool/join_member" + apiKey,
}
module.exports = {
  getDate: getDate
}