//index.js
//获取应用实例
const app = getApp()

//tempFilePath 暂存路径
//cloudFilePath 云端路径
//type 识别类型


Page({
  data: {
    swiper: [
      '../../images/swiper/swiper1.png',
      '../../images/swiper/swiper2.png',
      '../../images/swiper/swiper3.png',
    ],
    base64: ''
  },

  onLoad: function() {

  },
  //当点击了选项后的事件处理函数
  onSelection: function(options) {
    var that = this;
    //此处的tempfilepath和type均为info页面所要得知的参数
    var tempFilePath;
    var type = options.target.dataset.type;

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
            app.globalData.base64 = res.data
            
            wx.navigateTo({
              url: '../info/info?type=' + type + '&tempFilePath=' + tempFilePath + '&prevPage=index',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        })
      },
    })
  },


})