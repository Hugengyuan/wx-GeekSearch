var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function() {
    if (this.data.avatarUrl == "") {
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
      })
    }
    this.onLoad()
  },
  loginClick: function() {
    wx.navigateTo({
      url: '../login/login',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
})