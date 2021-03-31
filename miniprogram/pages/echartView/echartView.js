// pages/echartView/echartView.js
import * as echarts from '../../ec-canvas/echarts';
const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec:{
      lazyLoad:false,
    },
    // 这个是日期 
    x15data:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    // 这个是最大温度
    y15data1:[18, 36, 55, 30, 58,20],
    // 这个是最小温度
    y15data2:[10, 30, 31, 50, 40, 20],
    location:'',
    daily:[],
    canvasWidth15:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let location = options.location
    // console.log(location)
    this.setData({
      location:location
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
    this.ecComponent = this.selectComponent('#mychart15')
    // 获取15天的数据
    this.getWeather15DailyData();
    
  },
  getWeather15DailyData:async function(){
    let location = this.data.location
    let {data,statusCode} = await util.getRequest('/v3/weather/daily.json',{
      location:location,
      start:-1,
      days:15
    })
    if(statusCode == 200){
      let daily = data.results[0].daily
      let highData = []
      let lowData = []
      let date = []
      for(let item of daily ){
        date.push(item.date)
        highData.push(item.high)
        lowData.push(item.low)
      }
      this.setData({
        daily:daily,
        date:date,
        highData:highData,
        lowData:lowData
      },()=>{
        this.getWidth()
      })
    }else{
      this.setData({
        daily:[]
      })
    }
  },
  getWidth:function(){
    // console.log(745613)
    var query = wx.createSelectorQuery()
    var len15 = this.data.daily.length;
    query.select('.forecastWidth').boundingClientRect((rect)=>{
      // console.log(rect)
      var canvasWidth15 = rect.width*len15
      this.setData({
        canvasWidth15:canvasWidth15
      },()=>{
        this.initCharts()
      })
    }).exec()
  },
  initCharts:function(){
    this.ecComponent.init((canvas,width,height,dpr)=>{
      const chart = echarts.init(canvas,null,{
        width:width,
        height:height,
        devicePixelRatio:dpr
      })
      canvas.setChart(chart)
      var option = {
       
        
        grid:{
          top:20,
          left:-5,
          right:0,
          bottom:0
        },
        xAxis:{
          type:'category',
          interval: 24 * 60 * 60 * 100,
          axisLine:{
            show:false,
            lineStyle:{
              color:'rgba(255,255,0,1)',
            },
          },
          
          data:this.data.date
        },
        yAxis:
          {
            type:'value',
            axisLine:{
              show:false,
              lineStyle:{
                color:'rgba(255,255,0,0)'
              },
            },
            axisLabel:{
              color:'rgba(255,255,0,0)'
            },
            splitLine:{
              lineStyle:{
                color:'rgba(255,255,0,0)'
              },
            }
          }
        ,
        series:[
          {
            name:'热度',
            type:'line',
            data:this.data.highData,
            symbol: 'circle',
            itemStyle : { 
              normal: {
                color: "#fda202",
                label : {
                  show: true
                },
                lineStyle:{
                  color:'#faea8e'
                }
              }
            },
            smooth:true
          },
          {
            name:'正面',
            type:'line',
            symbol: 'circle',
            data:this.data.lowData,
            itemStyle : { normal: {color: "#4094e9",label : {show: true},lineStyle:{
              color:'#a3e2fc'
            }}},
            smooth:true
          },
        ]
      }
      chart.setOption(option)
      this.chart = chart;
      return chart;

    })
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