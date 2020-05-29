// pages/history/history.js
const db = wx.cloud.database({
  env: 'geeksearch-n0n7s'
})
const history = db.collection('history')
const app = getApp();
Page({
  data: {
    result: [],
    list: [],
    tempFilePath: '',
    fileID: '',
  },

  onLoad: function(options) {
    var that = this;
    
    wx.showLoading({
      title: '载入中',
    })
    
    //获取用户历史纪录中的所有日期
    db.collection('history')
      .aggregate()
      .group({
        _id: 'db.command.aggregate.date'
      })
      .sort({
        _id: -1,
      })
      .end()
      .then(res => {
        that.setData({
          list: res.list
        })
        console.log(that.data.list)
      })
      .then(res => {
        //为解决循环异步问题引入async和await关键字
        async function sortList() {
          for (var i = 0; i < that.data.list.length; i++) {
            let a = await db.collection('history').where({
                _openid: '{{app.globalData._openid}}',
                date: that.data.list[i]._id
              })
              .get()
              .then(res => {
                that.data.result.push(res.data)
              })
          }
          that.setData({
            result: that.data.result
          })
          wx.hideLoading();
        }
        sortList();
      })
  },

  onShow:function(){
    this.setData({
      tempFilePath: '',
      fileID: '',
    })
  },

  historyClick: function(options) {
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
        url: '../info/info?type=' + options.currentTarget.dataset.type + '&tempFilePath=' + that.data.tempFilePath + '&prevPage=history' + '&id=' + options.currentTarget.dataset.id,
        success: function(res) {
        },
        fail: function(res) {
        },
        complete: function(res) {},
      })
    })
  },
  onLongHistory: function(options){
    wx.showModal({
      title: '删除记录',
      content: '是否删除记录',
      success(res) {
        if (res.confirm) {
          db.collection('history').doc(options.currentTarget.dataset.id).remove({
            success: function (res) {
              wx.showToast({
                title: '删除成功',
              })
              wx.hideToast()
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  }
})