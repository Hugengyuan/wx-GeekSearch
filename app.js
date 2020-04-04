//app.js
App({

  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var that = this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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
    console.log(that.globalData.accessToken)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getUserOpenId',
      // 传给云函数的参数
      success: function(res) {
        that.globalData._openid = res.result.openid
        console.log(that.globalData._openid)
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