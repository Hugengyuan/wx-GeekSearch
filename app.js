//app.js
App({

  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var that = this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

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

  //全局变量
  globalData: {
    userInfo: [],
    _openid: '',
    accessToken: '',
    base64: '',
    filePath: '',

  }
})