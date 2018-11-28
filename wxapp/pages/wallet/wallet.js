// pages/wallet/wallet.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    money:0.00,
    total_money:0.00,
    tixian:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    page.getData();
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
  topbartoggle: function (e) {
    var page = this;
    var id = e.target.dataset.id;
    var list = [];
    switch (id) {
      case '1':
        list = page.data.profit_list;
        break;
      case '2':
        list = page.data.pay_list;
        break;
      default:
        list = page.data.profit_list;
    }
    this.setData({
      index: id,
      list: list,
    });
  }, 
  /**
 * 帖打赏列表页面数据加载
 */
  getData: function (id) {
    var page = this;
    var id = id;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.request({
      url: 'se_set/wallet',
      method: 'get',
      // data: {
      //   id: id,
      // },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            money: res.data.money,
            pay_list: res.data.payList,
            profit_list: res.data.profitList,
            total_money: res.data.total_money,
            list: res.data.profitList,
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