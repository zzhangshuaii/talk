// pages/special/special.js
var app = getApp();
var wxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    page.getDetailsInfo(options);
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
 * 获取贴详情
 */
  getDetailsInfo: function (options) {
    var page = this;
    var options = options;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    app.request({
      url: 'index/details',
      method: 'get',
      data: {
        id: options.id,
      },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          var posts_content = res.data.posts_content;
          wxParse.wxParse("detail", "html", posts_content, page);
          page.setData({
            detailsImg: res.data.imgList,
            data: res.data,
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
   * 点赞
   */
  saveLike: function (e) {
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.request({
      url: 'collection/setLike',
      method: 'GET',
      data: {
        post_id: page.data.data.id,
      },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          var data = page.data.data;
          data.like       = true;
          data.posts_like ++;
          page.setData({
            data: data,
          });
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
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
})