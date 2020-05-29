// pages/message/message.js
const db = wx.cloud.database({
  env: 'geeksearch-n0n7s'
})
const $ = db.command.aggregate
const app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: [],
    message_id: '',
    comment: '',
    commentlist: [],
    ifdelete: false
  },

  onLoad: function(options) {
    let that = this
    let message = JSON.parse(options.message)
    this.setData({
      message: message,
      message_id: message._id
    })
    if(message._openid == app.globalData._openid){
      that.setData({
        ifdelete: true
      })
    }
  },

  onShow: function(options) {
    db.collection('comment')
      .where({
        message_id: this.data.message_id
      })
      .orderBy(
        'comments_time', 'asc'
      )
      .get()
      .then(res => {
        this.setData({
          commentlist: res.data
        })
        console.log(res.data)
      })
  },

  inputComment: function(options) {
    this.data.comment = options.detail.value
  },

  completeComment: function(options) {
    var that = this
    db.collection("comment").add({
      data: {
        comments_info: that.data.comment,
        comments_avatarUrl: app.globalData.avatarUrl,
        comments_nickName: app.globalData.nickName,
        message_id: that.data.message_id,
        comments_time: util.formatTime(new Date()),
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
      }
    })

    this.onShow()
  },

  onDeleteMessage: function(){
    let that = this
    db.collection('message').doc(that.data.message._id).remove({
      success: function (res) {
        console.log(res.data)
      }
    })
    wx.navigateBack({
      delta: 1,
    })
  }

})