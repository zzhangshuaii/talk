//index.js
//获取应用实例
const app = getApp()
var pageNum = 1;
Page({
  data: {
    index: 1,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    special:[],
    showLoading:false,
    showNoContent: false,
    Ads: {
      Ads: [],
      adStyle: '',
      isShow: '',
      height: '',
    }
  },
  onLoad: function () {
    var page = this;
    page.getIndexInfo();
    page.getADSList();
  },
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
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
      var page = this;
      if(page.data.index == 1){
          page.getIndexInfo();
      }else{
          pageNum = 1;
          page.setData({
              special: [],
          })
          page.getSpecial(pageNum);
      }
      wx.stopPullDownRefresh();
  },
  topbartoggle:function(e){
    var page = this;
    var id = e.target.dataset.id;
    if (id==2){
      pageNum = 1;
      page.setData({
        special: [],
      })
      page.getSpecial(pageNum);
    }
    this.setData({
      index: id,
    });
  },  
  /**
   * 前往发帖
   */
  goToPost: function (e) {
    wx.navigateTo({
      url: '/pages/post/post',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 获取首页精选信息
   */
  getIndexInfo:function(e){
    var page = this;
    app.request({
      url: 'index/index',
      method: 'get',
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            imgUrls:res.data.banner,
            choice:res.data.choice,
            newest:res.data.newest,
            float_window:res.data.float_window,
          });
          wx.setStorage({
              key: "wxapp_name",
              data: res.data.wxapp_name ? res.data.wxapp_name:'上科大Talk',
          });
          wx.setNavigationBarTitle({
              title: res.data.wxapp_name ? res.data.wxapp_name : '上科大Talk',
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 1000);
      }
    });
  },
  /**
   * 前往文章详情
   */
  goToDetails: function (e)
  {
    var page = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id='+id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  /**
   * 获取专题列表
   */
  getSpecial: function (pageNum){
    console.log(pageNum);
    var page = this;
    app.request({
      url: 'article_list/special',
      method: 'get',
      data: {page:pageNum},
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          var special = page.data.special.concat(res.data.list);
          
          page.setData({
            special: special,
            total: res.data.total,
            total_page: res.data.total_page,
            showLoading: false,
          });
          if (res.data.total_page==pageNum){
            page.setData({
              showNoContent:true,
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 1000);
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this;
    if (page.data.showNoContent){
      return;
    }
    page.setData({
      showLoading:true,
    });
    if (page.data.total_page<=pageNum){
      page.setData({
        showLoading: false,
        showNoContent:true,
      });
      return;
    }
    pageNum += 1;
    page.getSpecial(pageNum);
  },
  /**
   * 前往列表页
   */
  goToList:function(e) {
    var page = this;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/list/list?type='+type,
    })
  },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})
