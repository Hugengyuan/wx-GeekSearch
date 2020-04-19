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