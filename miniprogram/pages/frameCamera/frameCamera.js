const ctxPuzzle = wx.createCanvasContext("puzzleCanvas", this)
Page({
  data:{
    cameraInfo: {
      width: 0,
      height:0,
    },
    systemInfo:{},
    frameImageInfo:{},
    devicePosition:'back'
  },
  onLoad() {
    var that = this
    that.ctx = wx.createCameraContext()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          menuButtonBoundingClientRect: wx.getMenuButtonBoundingClientRect(),
          systemInfo:res
        })
        wx.getImageInfo({
          src: 'cloud://normal-env-ta6pc.6e6f-normal-env-ta6pc-1300924598/frame/kisspng-pink-butterfly-pink-frame-5a9bce6d7bac80.7134860815201603655066.png',
          success:res=>{
            console.log(res)
            console.log(that.data.systemInfo)
            var cameraInfo = {}
            cameraInfo.width = that.data.systemInfo.windowWidth
            cameraInfo.height = that.data.systemInfo.windowWidth / res.width * res.height
            cameraInfo.top = (that.data.systemInfo.windowHeight-cameraInfo.height)/2
            that.setData({
              cameraInfo:cameraInfo,
              frameImageInfo:res
            })
            console.log(that.data.cameraInfo)
          }
        })
      },
    })
  },
  takePhoto() {
    // wx.vibrateShort({
      
    // })
    var that = this
    that.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.getImageInfo({
          src: res.tempImagePath,
          success:res=>{
            console.log(res)
            ctxPuzzle.drawImage(res.path, 0, res.height*that.data.cameraInfo.top/that.data.systemInfo.windowHeight, res.width, res.height*that.data.cameraInfo.height/that.data.systemInfo.windowHeight, 0, 0, that.data.cameraInfo.width, that.data.cameraInfo.height)
            ctxPuzzle.drawImage(that.data.frameImageInfo.path, 0, 0, that.data.frameImageInfo.width, that.data.frameImageInfo.height,0,0,that.data.cameraInfo.width,that.data.cameraInfo.height)
            ctxPuzzle.draw()
            var timeName = setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'puzzleCanvas',
                fileType: "png",
                success: function (res) {
                  // wx.hideLoading()
                  // that.setData({
                  //   completeImageInfo: res.tempFilePath
                  // })
                  wx.previewImage({
                    urls: [res.tempFilePath],
                  })
                  clearTimeout(timeName)
                }
              })
            }, 1000)
          }
        })
      }
    })
  },
  switchCamera(){
    if(this.data.devicePosition=="back"){
      this.setData({
        devicePosition:"front"
      })
    }else{
      this.setData({
        devicePosition: 'back'
      })
    }
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },

  go2Home() {
    wx.navigateBack({
      delta: 1,
    })
  },
})