// pages/lovetalk/lovetalk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,

    // 播放器
    isPlay: false,
    currentTime: '01:25',
    duration: '04:12',
    currentProcessNum: 6,
    totalProcessNum: 100,
    slide: false,
    musicInfo: {},
    rookieModel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    }); 
    let num = parseInt(Math.random() * (4 + 1), 10)
    // console.log(num)
    let list = [
       {
        "songName": "有点甜",
        "singer": "汪苏泷,By2",
        "songPicture": "../../images/love2.jpg",
        "songContent": ['在吗?', '担心你会蛀牙', '因为你太甜了'],
        "songFile": "cloud://lovetalkservice-4gzhpcul1a50833f.6c6f-lovetalkservice-4gzhpcul1a50833f-1305027853/mp3/有点甜.mp3"
      },
      {
        "songName": "因为爱情",
        "singer": "陈奕迅,王菲",
        "songPicture": "../../images/love5.jpg",
        "songContent": ['在吗?', '你，还相信爱情吗'],
        "songFile": "cloud://lovetalkservice-4gzhpcul1a50833f.6c6f-lovetalkservice-4gzhpcul1a50833f-1305027853/mp3/因为爱情.mp3"
      },
      {
        "songName": "但愿人长久",
        "singer": "王菲",
        "songPicture": "../../images/love4.jpg",
        "songContent": ['在吗?', '月是天上月', '你是心上人'],
        "songFile": "cloud://lovetalkservice-4gzhpcul1a50833f.6c6f-lovetalkservice-4gzhpcul1a50833f-1305027853/mp3/但愿人长久.mp3"
      },
      {
        "songName": "甜蜜蜜",
        "singer": "邓丽君",
        "songPicture": "../../images/love3.jpg",
        "songContent": ['在吗?', '我还是喜欢邓丽君的歌', '喜欢张曼玉和黎明的电影', '还有喜欢你'],
        "songFile": "cloud://lovetalkservice-4gzhpcul1a50833f.6c6f-lovetalkservice-4gzhpcul1a50833f-1305027853/mp3/甜蜜蜜.mp3"
      },
      {
        "songName": "好想好想",
        "singer": "古巨基",
        "songPicture": "../../images/love6.jpg",
        "songContent": ['在吗?', '告诉你个秘密', '我有超能力', '超级想你'],
        "songFile": "cloud://lovetalkservice-4gzhpcul1a50833f.6c6f-lovetalkservice-4gzhpcul1a50833f-1305027853/mp3/好想好想.mp3"
      }
    ]
    let musicInfo = list[num]
    this.setData({ musicInfo: musicInfo })
    this.playMusic()
  },
  playMusic: function () {
    let that = this;
    let musicInfo = this.data.musicInfo
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    player();
    function player(){
      
    backgroundAudioManager.src = musicInfo.songFile
    backgroundAudioManager.title = musicInfo.songName
    that.setData({
      currentTime: '00:00',
      currentProcessNum: 0,
      isPlay: true,
      backgroundAudioManager
    })
    backgroundAudioManager.onTimeUpdate(() => {
      that.setData({
        totalProcessNum: backgroundAudioManager.duration,
        currentTime: that.formatSecond(backgroundAudioManager.currentTime),
        duration: that.formatSecond(backgroundAudioManager.duration)
      })
      if (!that.data.slide) {
        that.setData({
          currentProcessNum: backgroundAudioManager.currentTime,
        })
      }

    })
    backgroundAudioManager.onEnded(() => {
      // that.setData({
      //   isPlay: false
      // })
      player()
    })
    }
    
  },
  end: function (e) {
    let position = e.detail.value
    let backgroundAudioManager = this.data.backgroundAudioManager
    this.setData({
      currentProcessNum: position,
      slide: false
    })
    backgroundAudioManager.seek(position) //改变歌曲进度
  },
  formatSecond: function (second) {
    var secondType = typeof second;
    if (secondType === "number" || secondType === "string") {
      second = parseInt(second);
      var minute = Math.floor(second / 60);
      second = second - minute * 60;
      return ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
    } else {
      return "00:00";
    }
  },
  handleToggleBGAudio() {
    const backgroundAudioManager = this.data.backgroundAudioManager
    //如果当前在播放的话
    if (this.data.isPlay) {
      backgroundAudioManager.pause();//暂停
    } else {      //如果当前处于暂停状态
      backgroundAudioManager.play();//播放
    }
    this.setData({
      isPlay: !this.data.isPlay
    })
  },
  openDialog:function(){
    this.setData({
      rookieModel:true
    })
  },
  closeDialog:function(){
    this.setData({
      rookieModel:false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    let item = this.data.musicInfo
    return{
      title: '在吗?',
      imageUrl: `${item.songPicture}`,
      path: `pages/lovetalk/lovetalk`, //点击分享的图片进到哪一个页面
    }
  }
})