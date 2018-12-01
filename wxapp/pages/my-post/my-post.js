// pages/my-post/my-post.js
const app = getApp();
var pageNum = 1;
var Base64 = require('js-base64').Base64;
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
    page.getPostInfo();
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
   * 获取我的发帖列表
   */
  getPostInfo: function () {
    var page = this;
    app.request({
      url: 'article_list/getUserArt',
      method: 'get',
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          for (var i in res.data.list) {
            var temp = res.data.list[i];
            temp.posts_content = Base64.decode(temp.posts_content);
            temp.posts_title = Base64.decode(temp.posts_title);
            res.data.list[i] = temp;
          }
          page.setData({
            list: res.data.list,
            total: res.data.total,
            total_page: res.data.total_page,
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
  goToPostDetails:function(e){
    var page = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },  
  /**
   * 长按触发事件
   * 删除收藏
   */
  removerEvent: function (e) {
    var page = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除贴子'],
      success: function (res) {
        if (res.tapIndex == 0) {
          app.request({
            url: 'article_list/delArt',
            method: 'get',
            data: {
              id: id,
            },
            success: function (res) {
              if (res.code == 0) {
                var list = page.data.list;
                list.splice(index, 1);
                page.setData({
                  list: list,
                });
                wx.showToast({
                  title: '取消成功',
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
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  },
})