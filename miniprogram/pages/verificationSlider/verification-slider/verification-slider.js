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
    onChange(e) {
      this.setData({
        oldx: e.detail.x
      })
    },
    onEnd() {
      if (this.data.isOk) {
        return;
      }
      if ((this.data.oldx + 1) > (this.data.size.pathway - this.data.size.track)) {
        this.setData({
          isOk: true
        }, () => {
          this.triggerEvent('result');
        });
      } else {
        this.setData({
          x: 0,
          oldx: 0
        })
      }
    }
  }
})