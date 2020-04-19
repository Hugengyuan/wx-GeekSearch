const app = getApp()
var util = require('../../utils/util.js')
const db = wx.cloud.database({
  env: 'geeksearch-n0n7s'
})

const history = db.collection('history')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [{
      name: '',
      score: '',
      bake_info: [],
    }],
    tempFilePath: '', //  本地暂存路径
    fileID: '', //存储路径
    like: '',
    type: '',
    doc: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var arr;
    //显示loading
    wx.showLoading({
      title: '识别中',
      icon: 'loading',
    })
    //请求百度API
    new Promise((reject, resolve) => {
        wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/image-classify' + options.type + '?access_token=' + app.globalData.accessToken,
          data: {
            image: app.globalData.base64,
            baike_num: 5
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(res) {
            that.setData({
              result: res.data.result,
            })
            for (var i = 0; i < res.data.result.length; i++) {
              //对data赋值必须要setData，否则不会将数据赋值给视图层
              arr = 'result[' + i + '].score'
              //此处修改score的类型为字符串
              //当是动物识别时返回的score是String，其他的都为unit32
              if (res.data.result[i].score.constructor === String) {
                that.setData({
                  [arr]: parseFloat(res.data.result[i].score).toFixed(2)
                })
              } else {
                that.setData({
                  [arr]: res.data.result[i].score.toFixed(2)
                })
              }
            };
            resolve();
            wx.hideLoading();
          },
          fail(res) {
            console.log("获取失败")
            reject();
          },
          complete() {}
        })
      })
      .then(function() {

      })

    this.setData({
      tempFilePath: options.tempFilePath,
      type: options.type,
      like: false,
    })
    //info页面有可能是从index或者history页面跳转而来
    //只有从index页面的跳转才添加记录

    if (options.prevPage == 'index') {
      this.addRecord();
    } else {
      this.setData({
        id: options.id
      })
      db.collection('history').doc(options.id).get({
        success: function(res) {
          // res.data 包含该记录的数据
          console.log(res.data)
          that.setData({
            like: res.data.like
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },


  //存入数据库
  addRecord: function() {
    var that = this;
    var temp;
    //cloudFilePath为格式化后的云端存储路径
    var cloudFilePath = 'images/' + that.data.tempFilePath.slice(11);
    //上传文件
    new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: cloudFilePath, // 上传至云端的路径
          filePath: that.data.tempFilePath, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            resolve(res.fileID);
          },
          fail(res) {
            reject(Error);
          }
        })
      })
      .then(function(fID) {
        that.setData({
          fileID: fID,
        })
        db.collection('history').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            date: util.formatTime(new Date()).slice(0, 10),
            tempFilePath: that.data.tempFilePath,
            fileID: that.data.fileID,
            type: that.data.type,
            like: false
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            that.data.id = res._id
          }
        })
      })
  },

  updateLike: function(e) {
    var that = this;
    
    if (e.target.id == 'dislike') {
      wx.showToast({
        title: '加入收藏',
        icon: 'success',
      });
      db.collection('history').doc(that.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          like: true
        },
        success: function(res) {
          that.setData({
            like: true
          })
          console.log(res.data)
        }
      })
    } else {
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        
      });
      db.collection('history').doc(that.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          like: false
        },
        success: function(res) {
          that.setData({
            like: false
          })
          console.log(res.data)
        }
      })
    }
  }
})