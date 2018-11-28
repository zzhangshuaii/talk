// pages/withdrawals/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tx_money:0,
    poundage:0.1,
    money:0,
    min_moenry:1,
    max_monery:1000,
    show_text:0,
    service_charge:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    app.request({
      url: 'Withdrawals/index',
      method: 'get',
      success: function (res) {
        if (res.code == 0) {
          page.setData({
            money: res.data.money,
            poundage: res.data.poundage,
            min_moenry: res.data.min_moenry,
            max_monery: res.data.max_monery,
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
   * 选择其他到账方式
   */
  selectTarget:function(e) {
    wx.showModal({
      title: '提示',
      content: "当前仅支持提现至微信余额",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  /**
   * 设置提现金额
   */
  setTxMoney:function (e) {
    var page = this;
    var money = e.detail.value;
  
    page.verification(money);

    // if (page.data.show_text != 0){
    //   return;
    // }
    page.setData({
      tx_money: money,
    });
  },
  /**
   * 全部提现
   */
  allMoney: function (e) { 
    var page = this;
    page.verification(page.data.money);
    page.setData({
      tx_money: page.data.money,
    });
  },
  /**
   * 验证金额
   */
  verification: function (money){
    var page = this;
    var money = parseFloat(money) ? parseFloat(money):0;
    var show_text = page.data.show_text;
    var service_charge = (money * (page.data.poundage / 100)).toFixed(2);
    show_text = 0;
    if (money > page.data.money) {
      show_text = 2;
    }
    if (money > page.data.max_monery) {
      show_text = 3;
    }
    if (money < page.data.min_moenry) {
      show_text = 1;
    }
    if (money == '') {
      show_text = 0;
    }
    page.setData({
      show_text: show_text,
      service_charge: service_charge,
    });
  },
  /**
   * 提现
   */
  withdrawals: function (e) {
    console.log(e);
    var page = this;
    var formId = e.detail.formId;     // 获取formId
    var show_text = page.data.show_text;
    var money = page.data.tx_money;
    if (money<=0){
      return;
    }
    switch (show_text){
      case 1:
        wx.showModal({
          title: '提示',
          content: "提现金额不能低于"+page.data.min_moenry,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        break;
      case 2:
        wx.showModal({
          title: '提示',
          content: "金额已超过可提现金额",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        break;
      case 3:
        wx.showModal({
          title: '提示',
          content: "提现金额不能超过" + page.data.max_monery,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        break;
      // default:
    }
    if (show_text != 0){
      return;
    }

    app.request({
      url: 'withdrawals/apply',
      method: 'POST',
      data:{
        money: page.data.tx_money,
        type:1,
        form_id:formId,
      },
      success: function (res) {
        if (res.code == 0) {
          wx.showModal({
            title: '提示',
            content: "提现申请成功",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/wallet/wallet?index=3',
                })
              }
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
  
})