//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    accessToken: '',
    tempFilePath: '',
    type: '',
    background: [
      '../../images/swiper/swiper1.png',
      '../../images/swiper/swiper2.png',
      '../../images/swiper/swiper3.png',
    ],
    selection: [{
        name: '通用识别',
        url: '../../images/selection/general.png',
        type: '/v2/advanced_general'
      },
      {
        name: '汽车识别',
        url: '../../images/selection/car.png',
        type: '/v1/car'
      },
      {
        name: '动物识别',
        url: '../../images/selection/animal.png',
        type: '/v1/animal'
      },
      {
        name: '植物识别',
        url: '../../images/selection/plant.png',
        type: '/v1/plant'
      },
      {
        name: '果蔬识别',
        url: '../../images/selection/ingredient.png',
        type: '/v1/classify/ingredient'
      },
      {
        name: '红酒识别',
        url: '../../images/selection/redwine.png',
        type: '/v1/redwine'
      },
      {
        name: '货币识别',
        url: '../../images/selection/currency.png',
        type: '/v1/currency'
      },
      {
        name: '地标识别',
        url: '../../images/selection/landmark.png',
        type: '/v1/landmark'
      },
    ],
    filePath: '',


  },
  //当点击了选项后的事件处理函数
  selectionClick: function(e) {
    var that = this;
    //此处的tempfilepath和type均为info页面所要得知的参数
    var tempFilePath;
    var type = e.target.dataset.type;
    
    //用户选择图片
    wx.chooseImage({
      success: function(res) {
        tempFilePath = res.tempFilePaths[0]
        //改变图片编码格式为base64使得符合百度API调用格式
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //本地路径
          encoding: 'base64', //编码格式
          success: res => {
            //base64编码为全局变量
            app.globalData.base64 = res.data,
              wx.navigateTo({
                url: '../info/info?type=' + type + '&tempFilePath=' + tempFilePath +'&prevPage=index',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
          }
        })
      },
    })

  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
})