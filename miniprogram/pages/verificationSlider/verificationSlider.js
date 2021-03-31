Page({
  data: {
    verificationCode:''
  },
  onLoad(){
    // 在页面中定义插屏广告
    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-28e0ccf1c026ec60'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  verifyResult() {
    wx.showToast({
      title: '滑块验证通过',
    })
  },
  showVerificationCode(res){
    this.setData({
      verificationCode:res.detail.text
    })
  }
})