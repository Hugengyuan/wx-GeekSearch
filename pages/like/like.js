// pages/history/history.js
const db = wx.cloud.database({
  env: 'geeksearch-n0n7s'
})
const $ = db.command.aggregate
const history = db.collection('history')
const app = getApp();
Page({
  data: {
    result: [],
    tempFilePath: '',
    fileID: '',
  },

  onShow: function() {
    wx.showLoading({
      title: '载入中',
    })
    var that = this;
    //获取用户历史纪录中的所有日期
    db.collection('history').where({
        _openid: '{{app.globalData._openid}}',
        like: true
      })
      .get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          that.data.result.push(res.data)
          that.setData({
            result: that.data.result
          })
          wx.hideLoading()
        },
      })
  },

  onHide: function() {
    this.data.result = [];
    this.setData({
      result: this.data.result,
    })
  },

  likeClick: function(options) {
    var that = this;
    this.setData({
      fileID: options.currentTarget.dataset.fileid,
    })
    new Promise((resolve, reject) => {
        wx.cloud.downloadFile({
          fileID: that.data.fileID, // 文件 ID
          success: res => {
            // 返回临时文件路径
            that.setData({
              tempFilePath: res.tempFilePath,
            })
            resolve()
          },
          fail: res => {
            console.error
            reject()
          }
        })
      })
      .then(function() {
        wx.getFileSystemManager().readFile({
          filePath: that.data.tempFilePath, //此处必须是本地路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            app.globalData.base64 = res.data
          },
          fail(res) {
            console.log(res)
          }
        })
        wx.navigateTo({
          url: '../info/info?type=' + options.currentTarget.dataset.type + '&tempFilePath=' + options.currentTarget.dataset.fileid + '&prevPage=history' + '&id=' + options.currentTarget.dataset.id,
          success: function(res) {
            console.log("yes")
          },
          fail: function(res) {
            console.log("wrong")
          },
          complete: function(res) {},
        })
      })
  }
})