// pages/weather/weather.js
const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lifeIndexInfo:{},
    daily:[],
    now:{},
    last_update:'',
    // 图表
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // // console.log(app.globalData.id)
    // // 获取地理位置
    // let data =await util.getLocation()
    // // console.log(data)
    // let district = data.result.address_component.district
    // let street = data.result.address_component.street
    // let lat = data.result.location.lat
    // let lng = data.result.location.lng
    // let location = `${lat}:${lng}`
    // this.setData({
    //   location:location,
    //   lat:lat,
    //   lng:lng,
    //   locationString:`${district} ${street}`
    // })
    // this.initData()
    // // await this.getAirDailyData()
  },
  bindSearch:function(){
    wx.navigateTo({
      url: `../search/search`
    })
  },
  initData:async function(){
    // 获取当天的天气
    await this.getNowWeatherData()
    // 下雨情况
    await this.getRainData()
    // 24小时之内天气
    await this.getHourForecastData()
    // 日出日落
    await this.getSunData()
    // 获取生活指数
    await this.getLifeIndexData()
    // 获取7天天气的预报
    await this.getWeatherDailyData();
    // 空气质量
    await this.getAirDailyData()
  },
  getNowWeatherData:async function(){
    let location = this.data.location
    let {data,statusCode} = await util.getRequest('/v3/weather/now.json',{
      location
    })
    // console.log(data)
    if(statusCode==200){
      let last_update = data.results[0].last_update
      let now = data.results[0].now
      this.setData({
        now:now,
        last_update:last_update
      })
    }
  },
  getRainData:async function(){
    let lat = this.data.lat
    let lng = this.data.lng
    let {data,statusCode} = await util.getRequest1(`${lng},${lat}`)
    if(statusCode == 200){
      let description = data.result.minutely.description
      this.setData({
        description:description
      })
    }
  },
  getHourForecastData:async function(){
    let location = this.data.location
    let { data, statusCode } = await util.getRequest('/v3/weather/hourly.json',{
      location,start:1,hours:24
    }) 
    if( statusCode == 200 ) {
      // console.log(data)
      let hourly = data.results[0].hourly
      this.setData({
        hourly:hourly
      })
    }
  },
  getSunData:async function(){
    let location = this.data.location
    let { data, statusCode } = await util.getRequest('/v3/geo/sun.json',{
      location,start:0,days:1
    }) 
    if( statusCode == 200 ) {
      // console.log(data)
      let sun = data.results[0].sun
      this.setData({
        sun:sun
      })
    }
  },
  getLifeIndexData:async function(){
    let location = this.data.location
    let {data,statusCode} = await util.getRequest('/v3/life/suggestion.json',{location:location})
    // console.log(data.results[0].suggestion)
    if(statusCode==200){
      // console.log(data.results[0])
      let suggestion = data.results[0].suggestion
      let data1 = {
        "dressing":suggestion.dressing.brief,
        "fishing":suggestion.fishing.brief,
        "flu":suggestion.flu.brief,
        "sport":suggestion.sport.brief,
        "uv":suggestion.uv.brief,
        "car_washing":suggestion.car_washing.brief
      }
      this.setData({
        lifeIndexInfo:data1
      })
    }else{

    }
  },
  getAirDailyData:async function(){
    let location = this.data.location
    let {data,statusCode} = await util.getRequest('/v3/air/now.json',{
      location:location,
      
    })
    if(statusCode==200){
      // let daily2 =  data.results[0].daily
      console.log(data)
      let air = data.results[0].air
      this.setData({
        air:air
      })
    }
  },
  getWeatherDailyData:async function(){
    let location = this.data.location
    let {data,statusCode} = await util.getRequest('/v3/weather/daily.json',{
      location:location,
      start:-1,
      days:7
    })
    if(statusCode == 200){
      let daily = data.results[0].daily
      this.setData({
        daily:daily
      })
    }else{
      this.setData({
        daily:[]
      })
    }
  },
  bindEchartView:function(){
    let location = this.data.location;
    wx.navigateTo({
      url: `../echartView/echartView?location=${location}`
    })
  },
  bindAirQuality:function(){
    let location = this.data.location;
    let locationString = this.data.locationString;
    wx.navigateTo({
      url: `../airQuality/airQuality?location=${location}&locationName=${locationString}`
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
  onShow:async function () {
    this.ecComponent15 = this.selectComponent('#mychart15')
    let id = app.globalData.id 
    let name = app.globalData.name
    let data =await util.getLocation()
    // console.log(data)
    let district = data.result.address_component.district
    let street = data.result.address_component.street
    let lat = data.result.location.lat
    let lng = data.result.location.lng
    let location = id||`${lat}:${lng}`
    let locationString =name||`${district} ${street}` 
    this.setData({
      location:location,
      lat:lat,
      lng:lng,
      locationString:locationString
    })
    this.initData()
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
    // console.log(56+5+6)
    this.initData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(56+5+6)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})