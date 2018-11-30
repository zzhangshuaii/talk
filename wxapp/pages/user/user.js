// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts_num:0,
    message_num:0,
    money:0.00,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
          page.setData({
            'userinfo':res.data,
          })
      },
    });
    wx.getStorage({
        key: 'wxapp_name',
        success: function (res) {
            wx.setNavigationBarTitle({
                title: res.data
            });
        }
    });
    page.getSetInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.selectComponent("#sign").isSign();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
        var page = this;
        app.request({
            url: 'se_set/index',
            method: 'get',
            success: function (res) {
                console.log(res);
                if (res.code == 0) {
                    page.setData({
                        posts_num: res.data.posts_num,
                        message_num: res.data.message_num,
                        money:res.data.money,
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
   * 获取系统信息
   */
  getSetInfo:function () {
    var page = this;
    app.request({
      url: 'se_set/index',
      method: 'get',
      // data: {
      //   id: id,
      // },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            stores:res.data.set,
            posts_num: res.data.posts_num,
            message_num: res.data.message_num,
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
   * 拨打电话
   */
  callTel:function() {
    var page = this;
    wx.makePhoneCall({
      phoneNumber: page.data.stores.tel //仅为示例，并非真实的电话号码
    });
  },
  /**
   * 前往关于我们
   */
  goToExplain:function () {
    var page = this;
    wx.navigateTo({
      url: '/pages/explain/explain'
    })
  },
  /**
   * 打开搜藏列表
   */
  goToCollection:function (e) {
    var page = this;
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },
  /**
   * 前往发帖
   */
  goToPost: function (e) {
    console.log("go to post");
    wx.navigateTo({
      url: '/pages/post/post',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 调用组件签到
   */
  signEvent: function(e){
    this.selectComponent("#sign").down();
  }
})