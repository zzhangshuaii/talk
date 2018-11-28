// pages/my-comment/my-comment.js
const app = getApp();
var pageNum = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    showNoContent: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var page = this;
      pageNum = 1;
      page.getCommentList();
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
    if (page.data.showNoContent) {
      return;
    }
    page.setData({
      showLoading: true,
    });
    if (page.data.total_page <= pageNum) {
      page.setData({
        showLoading: false,
        showNoContent: true,
      });
      return;
    }
    pageNum++;
    app.request({
      url: 'comment/userComments',
      method: 'get',
      data: {
        page: pageNum,
      },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          var list = page.data.list.concat(res.data.list);
          page.setData({
            total_page: res.data.total_page,
            total: res.data.total,
            list: list,
            showLoading: false,
          });
          if (res.data.total_page == pageNum) {
            page.setData({
              showNoContent: true,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取评论列表
   */
  getCommentList:function(){
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.request({
      url: 'comment/userComments',
      method: 'get',
      // data: {
      //   id: options.id,
      // },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            total_page: res.data.total_page,
            total: res.data.total,
            list: res.data.list,
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
   * 前往贴详情
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
  }
})