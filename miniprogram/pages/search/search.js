// pages/search/search.js
timeId:0
const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    results:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindValue:function(e){
    let {value} = e.detail
    // if(value=='在吗'){
    //   wx.navigateTo({
    //     url: `../lovetalk/lovetalk`
    //   })
    //   return
    // }
    clearTimeout(this.timeId)
    
    this.setData({
      value:value
    })
    this.timeId = setTimeout(()=>{
      this.search(value)
    },1000) 
  },
  bindCityItem:async function(e){
    let id = e.currentTarget.dataset.id
    if(id == '0'){
      let data =await util.getLocation()
      let district = data.result.address_component.district
      let street = data.result.address_component.street
      let lat = data.result.location.lat
      let lng = data.result.location.lng
      let location = `${lat}:${lng}`
      let locationString = `${district} ${street}` 
      app.globalData.id = location
      app.globalData.name = locationString
    }else if(id == '1'){ 
      app.globalData.id = 'beijing'
      app.globalData.name = '北京市'
    }else if(id == '2'){ 
      app.globalData.id = '广州'
      app.globalData.name = '广州市'
    }else if(id == '3'){ 
      app.globalData.id = '深圳'
      app.globalData.name = '深圳市'
    }else if(id == '4'){ 
      app.globalData.id = '上海'
      app.globalData.name = '上海市'
    }else if(id == '5'){ 
      app.globalData.id = '南京'
      app.globalData.name = '南京市'
    }else if(id == '6'){ 
      app.globalData.id = '杭州'
      app.globalData.name = '杭州市'
    }else if(id == '7'){ 
      app.globalData.id = '武汉'
      app.globalData.name = '武汉市'
    }
    wx.navigateBack({
      delta: 1
    })
  },
  bindItem:function(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
   app.globalData.id = id
   app.globalData.name = name
    wx.navigateBack({
      delta: 1
    })
  },
  bindCancel:function(){
    
    wx.navigateBack({
      delta: 1
    })
  },
  bindDel:function(){
    this.setData({
      value:'',
      results:[]
    })
  },
  search:async function(value){
    
    let {data,statusCode} = await util.getRequest('/v3/location/search.json',{
      q:(value||'')
    })
    if(statusCode == 200){
      let results = data.results;
      this.setData({
        results:results
      })
    }else if(statusCode == 403){
      if(data.status_code == 'AP010001'){
        this.setData({
          results:[]
        })
      }
    }else{
      this.setData({
        results:[]
      })
    }
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
  onShareAppMessage: function () {

  }
})