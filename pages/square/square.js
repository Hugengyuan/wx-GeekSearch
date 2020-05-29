// pages/square/square.js
const db = wx.cloud.database({
  env: 'geeksearch-n0n7s'
})
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    list: [],
    currentTime: util.formatTime(new Date()),
    currentMessageNumber: 4,
    messageNumberLimit: 4
  },

  onLoad: function(options) {

  },

  onShow: function() {
    this.data.currentTime = util.formatTime(new Date())
    var that = this;
    new Promise(function(resolve, reject) {
        db.collection('message')
          .orderBy(
            "message_time", "desc"
          )
          .limit(that.data.messageNumberLimit)
          .get()
          .then(res => {
            resolve(res.data)
            
          })
      })
      .then(res => {

        // 对time进行处理
        for (var i = 0; i < res.length; i++) {
          if (that.data.currentTime.slice(0, 16) == res[i].message_time.slice(0, 16)) {
            res[i].message_time = "刚刚"
            console.log(res[i].message_time)
          } else if (that.data.currentTime.slice(0, 14) == res[i].message_time.slice(0, 14)) {
            res[i].message_time = String(parseInt(that.data.currentTime.slice(13, 15)) - parseInt(res[i].message_time.slice(13, 15))) + "分钟前"
            console.log(res[i].message_time)
          } else if (that.data.currentTime.slice(0, 10) == res[i].message_time.slice(0, 10)) {
            res[i].message_time = String(parseInt(that.data.currentTime.slice(11, 13)) - parseInt(res[i].message_time.slice(11, 13))) + "小时前"
            console.log(res[i].message_time)
          } else if (that.data.currentTime.slice(0, 7) == res[i].message_time.slice(0, 7)) {
            res[i].message_time = String(parseInt(that.data.currentTime.slice(7, 9)) - parseInt(res[i].message_time.slice(7, 9))) + "天前"
            console.log(res[i].message_time)
          }
        }
        console.log(res)
        that.setData({
          list: res
        })
      })
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //如果给了授权
          wx.getUserInfo({
            success: function(res) {
              app.globalData.avatarUrl = res.userInfo.avatarUrl;
              app.globalData.nickName = res.userInfo.nickName;
              console.log(app.globalData.avatarUrl)
            }
          })
        }
      }
    })
  },

  onPullDownRefresh: function() {
    wx.showLoading({
      title: '正在刷新',
    })
    this.onShow()
    wx.hideLoading()

    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this

    new Promise(function(resolve, reject) {
        db.collection('message')
          .orderBy(
          "message_time", "desc"
          )
          .skip(that.data.currentMessageNumber)
          .limit(that.data.messageNumberLimit)
          .get()
          .then(res => {
            console.log(res)
            if (res.data.length == 0) {
              wx.showToast({
                title: '已无更多数据',
                icon: 'none',
                duration: 2000
              })
            }
            resolve(res.data)
          })
      })
      .then(res => {
        //对time进行处理
        for (var i = 0; i < res.length; i++) {
          if (that.data.currentTime.slice(0, 16) == res[i].message_time.slice(0, 16)) {
            res[i].message_time = "刚刚"
            console.log(res[i].message_time)
          } else if (that.data.currentTime.slice(0, 14) == res[i].message_time.slice(0, 14)) {
            res[i].message_time = String(parseInt(that.data.currentTime.slice(14, 16)) - parseInt(res[i].message_time.slice(14, 16))) + "分钟前"
            console.log(res[i].message_time)
          } else if (that.data.currentTime.slice(0, 10) == res[i].message_time.slice(0, 10)) {
            res[i].message_time = String(parseInt(that.data.currentTime.slice(12, 14)) - parseInt(res[i].message_time.slice(12, 14))) + "小时前"
            console.log(res[i].message_time)
          } else if (that.data.currentTime.slice(0, 7) == res[i].message_time.slice(0, 7)) {
            res[i].message_time = String(parseInt(that.data.currentTime.slice(8, 10)) - parseInt(res[i].message_time.slice(8, 10))) + "天前"
            console.log(res[i].message_time)
          }
        }
        console.log(res)
        that.data.list = that.data.list.concat(res)
        that.setData({
          list: that.data.list
        })
        wx.hideLoading()
        that.data.currentMessageNumber += that.data.messageNumberLimit
      })

  },

  onPublish: function() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showToast({
            title: '您还未授权',
            icon: 'none'
          })
        } else {
          wx.navigateTo({
            url: '../publish/publish',
          })
        }
      }
    })
  },

  onMessage: function(e) {
    let message = JSON.stringify(this.data.list[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../message/message?message=' + message,
    })
  },

  onAgree: function(options) {
    let that = this

  }
})