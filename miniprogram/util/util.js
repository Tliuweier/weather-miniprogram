const app = getApp()
const QQMapWX = require('./qqmap-wx-jssdk.min')
const getRequest = function(url,params){

  let promise = new Promise(function(resolve,reject){
    wx.request({
      url: `${app.data.url}${url}`,
      method:'GET',
      data:{
        language:'zh-Hans',
        key:app.data.privateKey,
        ...params
      },
      success:function(res){
        resolve(res)
      },
      fail:function(err){
        reject(err)
      }
    })
  }).then(function(data){
    return data;
  }).catch(function(data){
    return data;
  })
  return promise;
}
const getRequest1 = function(params){

  let promise = new Promise(function(resolve,reject){
    wx.request({
      url: `${app.data.url1}/v2.5/${app.data.key}/${params}/minutely.json`,
      method:'GET',
      success:function(res){
        resolve(res)
      },
      fail:function(err){
        reject(err)
      }
    })
  }).then(function(data){
    return data;
  }).catch(function(data){
    return data;
  })
  return promise;
}
const getLocation = async function(){
  let qqmapsdk = new QQMapWX({
    key: app.data.mapKey // 必填
  });
  let promise = await new Promise(function(resolve, reject) {
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
        
      }
    })
  })
  let promise1 = new Promise(function(resolve,reject){
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: promise.latitude,
        longitude: promise.longitude
      },
      success: function(addressRes) {
        resolve(addressRes)
      },
      fail: function(res) {
        resolve(res)
      }
    })
  })
  return promise1;
}
module.exports = {
  getRequest:getRequest,
  getRequest1:getRequest1,
  getLocation:getLocation

}