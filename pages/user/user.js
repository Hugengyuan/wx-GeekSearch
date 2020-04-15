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
  onLoad: function (options) {
    //判断用户是否存在
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo.length == 0) {
      wx.redirectTo({
        url: '../login/login',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    else{
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
      })
    }

    
  },
  historyClick:function(){
    wx.navigateTo({
      url: '../history/history',
    })
  },
  likeClick: function () {
    wx.navigateTo({
      url: '../like/like',
    })
  },
  aboutClick: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  }
})