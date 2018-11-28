// pages/list/list.js
const app = getApp();
var url = '';
var pageNum = 1;
var label = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      special:[],
      showLoading:false,
      showNoContent: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var page = this;
      var type = "2";//options.type;
      pageNum = 1;
      switch ( type ) {
          case "1":
              url = 'article_list/istjArticle'; // 推荐
              break;
          case "2":
              url = 'article_list/newArticle';  // 最新
              break;
          case "3":
              url = 'article_list/labelArticle';  // 根据标签进入列表
              label = options.label;
              break;
          default:
              console.log("default");
      }
      
      wx.getStorage({
          key: 'wxapp_name',
          success: function (res) {
              wx.setNavigationBarTitle({
                  title: res.data
              });
          }
      });
      page.getListInfo();
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
      page.getListInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
    /**
     * 获取列表数据
     */
    getListInfo:function () {
        var page = this;
        app.request({
            url: url,
            method: 'get',
            data: { page: pageNum, lable:label},
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
     * 前往文章详情
     */
    goToDetails: function (e) {
      var page = this;
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/details/details?id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
    },
});