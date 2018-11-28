// pages/collection/collection.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var page = this;
      page.getList();
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
   * 获取我的收藏表示
   */
  getList:function (){
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    app.request({
      url: 'collection/userCollection',
      method: 'get',
      // data: {
      //   id: options.id,
      // },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            total_page:res.data.total_page,
            total:res.data.total,
            collection: res.data.list,
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
  goToPosts:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
      itemList: ['取消收藏'],
      success: function (res) {
        if (res.tapIndex == 0){
          app.request({
            url: 'collection/delCollection',
            method: 'get',
            data: {
              id: id,
            },
            success: function (res) {
              if (res.code == 0) {
                var collection = page.data.collection;
                collection.splice(index, 1);
                page.setData({
                  collection: collection,
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