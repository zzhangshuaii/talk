// component/ads.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Ads: null,
    adStyle: null,
    isShow: Boolean,
    height: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    Ads: [
    ],
    adStyle: 'ads-yangshi',
    isShow: false,
    height: "100px",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
    * 获取广告
    */
    getADSList: function () {
      var _this = this;
      app.request({
        url: "ads/getAdsList",
        method: 'get',
        data: {
          position: 'index'
        },
        success(result) {
          if (result.code == 0) {
            _this.setData({
              Ads: result.data,
            })
            console.log(_this.data.Ads);
          } else {
            _this.setData({
              isShow: true,
            })
          }
        }
      })
    },

  }
})
