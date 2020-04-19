//app.js
App({
  globalData: {
    _openid: '',
    accessToken: '',
    base64: '',
    filePath: '',
  },

  onLaunch: function() {
    //变量声明
    var that = this;

    //请求access_Token
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=XrNt0Qn9QstzL9t0ziLDx735&client_secret=WQDGhGsdypWebBQXNYwxSvxF4o5WoDb4', //仅为示例，并非真实的接口地址
      method: 'POST',
      success(res) {
        that.globalData.accessToken = res.data.access_token
        console.log("获取access_Token成功!")
      },
      fail: function(res) {
        console.log("获取access_Token失败!")
      },
    })

    //云数据库初始化
    wx.cloud.init({
      env: 'geeksearch-n0n7s'
    })
    
    //云函数调用
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getUserOpenId',
      // 传给云函数的参数
      success: function(res) {
        that.globalData._openid = res.result.openid
      },
      fail: console.error
    })
  },
})