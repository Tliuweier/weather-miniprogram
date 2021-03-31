var ctxShadow;
var ctxPuzzle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: String,
      value: "500rpx"
    },
    height: {
      type: String,
      value: "80rpx"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    oriSrc:'cloud://lovetalkservice-4gzhpcul1a50833f.6c6f-lovetalkservice-4gzhpcul1a50833f-1305027853/image/love4.jpg',
    imgPuzzle: '',
    imgShadow: '',
    translateX: 0,
    oriX:0,
    x: 0,
    oldx: 0,
    isOk: false,
    size: {},
    width:"500rpx",
    height:"80rpx"
  },
  ready() {
    this.setData({
      width:this.properties.width,
      height:this.properties.height
    })
    this.drawPic(140, 70, 5)
    let getSize = (selector) => {
      return new Promise((resolve, reject) => {
        let view = wx.createSelectorQuery().in(this).select(selector);
        view.fields({
          size: true,
        }, (res) => {
          resolve(res.width);
        }).exec();
      });
    }
    getSize("#pathway").then((res1) => {
      this.data.size.pathway = res1;
      getSize("#track").then((res2) => {
        this.data.size.track = res2;
      });
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawPic(x, y, r) {
      var that = this
      that.setData({
        translateX: -x,
        oriX:-x
      })
      ctxPuzzle = wx.createCanvasContext('canvasPuzzle',this)
      ctxShadow = wx.createCanvasContext('canvasShadow',this)
      this.clip(ctxPuzzle, x, y, r)
      wx.getImageInfo({
        src: that.data.oriSrc,
        success: function (res) {
          ctxPuzzle.drawImage(res.path, 0, 0, 250, 150);
          ctxPuzzle.restore();
          ctxPuzzle.draw(false, setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'canvasPuzzle',
              success: function (e) {
                console.log("!!!!", e)
                that.setData({
                  imgPuzzle: e.tempFilePath
                })
              },
              fail: function (e) {
                console.log("AAAA", e)
              }
            }, that)
          }, 100))
        }
      })
      this.clip(ctxShadow, x, y, r)
      ctxShadow.setFillStyle('black')
      ctxShadow.setGlobalAlpha(0.5)
      ctxShadow.fillRect(0, 0, 250, 150)
      ctxShadow.draw(false, setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'canvasShadow',
          success: function (e) {
            console.log("$$$$",e)
            that.setData({
              imgShadow: e.tempFilePath
            })
          }
        }, this)
      }, 100))
      
    },
    clip(ctx, x, y, r) {
      ctx.save();
      //开始一个新的绘制路径
      ctx.beginPath();
      //设置路径起点坐标
      ctx.moveTo(x, y);
      ctx.arcTo(x, y - r, x + r, y - r, r);
      ctx.lineTo(x + 2 * r, y - r);
      ctx.arcTo(x + 2 * r, y - 2 * r, x + 3 * r, y - 2 * r, r);
      ctx.arcTo(x + 4 * r, y - 2 * r, x + 4 * r, y - r, r);
      ctx.lineTo(x + 5 * r, y - r);
      ctx.arcTo(x + 6 * r, y - r, x + 6 * r, y, r);
      ctx.lineTo(x + 6 * r, y + r);
      ctx.arcTo(x + 7 * r, y + r, x + 7 * r, y + 2 * r, r);
      ctx.arcTo(x + 7 * r, y + 3 * r, x + 6 * r, y + 3 * r, r);
      ctx.lineTo(x + 6 * r, y + 4 * r);
      ctx.arcTo(x + 6 * r, y + 5 * r, x + 5 * r, y + 5 * r, r);
      ctx.lineTo(x + 4 * r, y + 5 * r);
      ctx.arcTo(x + 4 * r, y + 4 * r, x + 3 * r, y + 4 * r, r);
      ctx.arcTo(x + 2 * r, y + 4 * r, x + 2 * r, y + 5 * r, r);
      ctx.lineTo(x + r, y + 5 * r);
      ctx.arcTo(x, y + 5 * r, x, y + 4 * r, r);
      ctx.lineTo(x, y + 3 * r);
      ctx.arcTo(x + r, y + 3 * r, x + r, y + 2 * r, r);
      ctx.arcTo(x + r, y + r, x, y + r, r);
      ctx.lineTo(x, y);
      //先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
      ctx.closePath();
      ctx.clip();
      ctx.stroke(); //画线轮廓
    },
    onChange(e) {
      this.setData({
        oldx: e.detail.x,
        translateX:this.data.oriX+e.detail.x
      })
    },
    onEnd() {
      if (this.data.isOk) {
        return;
      }
      if (((this.data.oldx) > (-this.data.oriX-2))&&(this.data.oldx<(2-this.data.oriX))) {
        this.setData({
          isOk: true
        }, () => {
          this.triggerEvent('result');
        });
        console.log("isOk",this.data.isOk)
      } else {
        this.setData({
          x: 0,
          oldx: 0
        })
      }
    }
  }
})