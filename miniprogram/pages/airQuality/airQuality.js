// pages/airQuality/airQuality.js
const util = require('../../util/util.js')
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let location = options.location
    let locationName = options.locationName
    this.setData({
      location: location,
      locationName: locationName
    })
    this.getNowAirQualityData()
  },
  getNowAirQualityData: async function () {
    let location = this.data.location
    let { data, statusCode } = await util.getRequest('/v3/air/now.json', {
      location: location,
    })
    if (statusCode == 200) {
      // let daily2 =  data.results[0].daily
      // console.log(data)
      let air = data.results[0].air
      let last_update = data.results[0].last_update
      this.setData({
        air: air,
        last_update
      })
    }
  },
  getAirHourlyData: async function () {
    // get /v3/air/hourly.json
    let location = this.data.location
    let { data, statusCode } = await util.getRequest('/v3/air/hourly.json', {
      location: location,
      days: 1
    })
    if (statusCode == 200) {
      let hourly = data.results[0].hourly
      let date = []
      let aqi = []
      for (let item of hourly) {
        let time = item.time;
        let hour = new Date(time).getHours()
        // console()
        let month = new Date(time).getMonth()
        let date1 = new Date(time).getDate()
        let string = ''
        // if (hour == 0) {
        //   string = `${month + 1}月${date1}日`
        // } else {
          if (hour < 10) {
            hour = '0' + hour
          }
          string = `${hour}:00`
        // }
        let color = ''
        if(item.quality == '优'){
          color = '#17cf84'
        }else if(item.quality == '良'){
          color = '#fcbc50'
        }else if(item.quality == '轻度污染'){
          color = '#fc834f'
        }else if(item.quality == '中度污染'){
          color = '#fb5f5d'
        }else if(item.quality == '重度污染'){
          color = '#ab6ccd'
        }else if(item.quality == '严重污染'){
          color = '#7d3aab'
        }
        let item1 = {
          value:item.aqi,
          itemStyle:{
            color
          }
        }
        date.push(string)
        aqi.push(item1)
      }
      this.setData({
        hourly: hourly,
        date: date,
        aqi: aqi
      }, () => {
        this.getWidth()
      })
    }
  },
  getWidth: function () {
    var query = wx.createSelectorQuery()
    var len = this.data.hourly.length;
    // var canvasWidth15 = 30 * len
    query.select('.dateItem').boundingClientRect((rect)=>{
      // console.log(rect)
      var canvasWidth15 = rect.width*len
      this.setData({
        canvasWidth15:canvasWidth15
      },()=>{
        this.initCharts()
      })
    }).exec()
    
  },
  initCharts: function () {
    this.ecComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      })
      canvas.setChart(chart)
      var option = {
        tooltip:{
          
          formatter:function(params){
            console.log(params)
            var html = `${params.value}`
            return html;
          }
        },
        grid: {
          left:-15,
          top: 0,
          bottom:0,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          
          axisLine:{
            show:false,
            
            lineStyle:{
              color:'rgba(255,255,0,1)',
               
            },
          },
          axisTick: {
						alignWithLabel: true
          },
          axisLabel:{
            interval:5
          },
          show: false,
          data: this.data.date
        },
        yAxis:
        {
          type: 'value',
          show: false,
          axisTick: { //y轴刻度线
            show: false
          },
          axisLine: { //y轴
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed' // y轴分割线类型
            }
          },


        }
        ,
        series: [
          {
            name: 'aqi',
            type: 'bar',
            data: this.data.aqi,
          

            smooth: true
          },

        ]
      }
      chart.setOption(option)
      this.chart = chart;
      return chart;
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
    this.getAirHourlyData()
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