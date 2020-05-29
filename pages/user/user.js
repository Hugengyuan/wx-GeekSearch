var app = getApp();
Page({

  data: {
    scope: "false"
  },

  onLoad: function(options) {

  },

  onShow: function() {
    //打开页面时通过scope变量检测是否给予了授权
    //
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //如果给了授权
          that.setData({
            scope: "true"
          })
        }
      }
    })
  },

  historyClick: function() {
    wx.navigateTo({
      url: '../history/history',
    })
  },

  likeClick: function() {
    wx.navigateTo({
      url: '../like/like',
    })
  },

  aboutClick: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  getUserInfo: function() {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: '',
      success: function(res) {
        console.log(app.globalData)
        that.onShow()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})