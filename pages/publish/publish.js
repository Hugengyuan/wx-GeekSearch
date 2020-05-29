// pages/publish/publish.js
const db = wx.cloud.database({
  env: 'geeksearch-n0n7s'
})
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    tempFilePath: "../../images/icons/image_select.png",
    fileID: "",
    avatarUrl: "",
    nickName: "",
    content: "",
    location: "",
    hashtag: "",
    time: ""
  },

  onLoad: function(options) {
    this.setData({
      tempFilePath: options.tempFilePath,
      hashtag: options.hashtag
    })
  },

  inputContent: function(e) {
    this.data.content = e.detail.value
  },
  
  inputHashtag: function(e) {
    this.data.hashtag = e.detail.value
  },

  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        that.setData({
          tempFilePath: res.tempFilePaths[0]
        })
      },
    })
  },

  getLocation: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })
        }
      }
    })
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          location: res.name
        })
      },
    })
  },

  cancelButtonClick: function() {
    wx.navigateBack({})
  },

  publishButtonClick: function() {
    var that = this;
    if (that.data.tempFilePath == "../../images/icons/image_select.png") {
      wx.showToast({
        title: '您还未选择图片',
        icon: 'none'
      })
      return
    }
    if (that.data.content == "") {
      wx.showToast({
        title: '输入文字不能为空哦~',
        icon: 'none'
      })
      return
    }

    var cloudFilePath = 'images/' + that.data.tempFilePath.slice(11);
    //上传文件
    new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: cloudFilePath, // 上传至云端的路径
          filePath: that.data.tempFilePath, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            resolve(res.fileID);
            console.log("ok")
          },
          fail(res) {
            reject(Error);
            console.log(res)
          }
        })
      })
      .then(function(fID) {
        console.log(that.data)
        that.setData({
          fileID: fID,
        })
        console.log(that.data)
        db.collection("message").add({
          data: {
            message_picturepath: that.data.fileID,
            message_avatarURL: app.globalData.avatarUrl,
            message_username: app.globalData.nickName,
            message_info: that.data.content,
            message_location: that.data.location,
            message_hashtag: that.data.hashtag,
            message_time: util.formatTime(new Date()),
            message_commentnum: 0,
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            wx.showToast({
              title: '发布成功',
              icon: 'success'
            })
            wx.navigateBack({
            })
          }
        })
      })
  },

})