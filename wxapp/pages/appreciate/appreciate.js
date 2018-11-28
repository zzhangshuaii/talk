// pages/appreciate/appreciate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOther:false,
    money:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var page = this;
      var id = options.id;
      page.getData(id);
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
   * 打赏页面初次加载
   */
  getData: function (id) {
    var page = this;
    var id = id;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
      page.setData({
          post_id: id,
      });
    app.request({
      url: 'index/appreciate',
      method: 'get',
      data: {
        id: id,
      },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          if (res.data.user_id!=1){
            wx.setNavigationBarTitle({
              title: '奖励' + res.data.user_info.nickname
            });
          }
          page.setData({
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
   * 其他金额打开
   */
  otherMoney:function(e){
    var page = this;
    page.setData({
      showOther:true,
    });
  },
  /**
   * 固定金额触发
   */
  fixedMoney:function(e){
    var page = this;
    var money = e.currentTarget.dataset.money;
    page.setData({
        money: money,
    });
    page.appreciate();
  },
  /**
   * 打赏
   */
  appreciate:function(e){
    var page = this;
    var money = page.data.money;
    var to_user_id = page.data.data.user_id;
    var post_id = page.data.post_id;

    wx.showLoading({
        title: '加载中',
        mask: true,
    });
    app.request({
        url: 'order/pay',
        method: 'POST',
        data: {
            money: money,
            to_user_id: to_user_id,
            post_id: post_id,
        },
        success: function (res) {
            console.log(res);
            if (res.code == 0) {
                wx.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    'success': function (res) {
                        wx.showModal({
                            title: '提示',
                            content: '打赏成功',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    // wx.redirectTo({
                                    //     url: '/pages/details/details?id=' + page.data.post_id,
                                    // })
                                  wx.navigateBack({
                                    delta: 1
                                  })
                                }
                            }
                        });
                    },
                    'fail': function (res) {
                        wx.showModal({
                            title: '提示',
                            content: '打赏失败',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '/pages/details/details?id=' + page.data.post_id,
                                    })
                                }
                            }
                        });
                    }
                })
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
     * 自定义金额
     */
    setMoney:function(e){
        var page = this;
        var money = e.detail .value;
        page.setData({
            money:money,
        })
    } 
})