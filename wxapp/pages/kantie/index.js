// pages/kantie/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: [
      {
        'id': 1,
        'titl': '精选'
      },
      {
        'id': 2,
        'titl': '推荐'
      },
      {
        'id': 3,
        'titl': '新鲜'
      },
      {
        'id': 4,
        'titl': '闲聊'
      },
    ],
    cid: 1,
    activeFristIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    wx.getStorage({
        key: 'wxapp_name',
        success: function (res) {
            wx.setNavigationBarTitle({
                title: res.data
            });
        }
    });
    
    page.getFristClass();
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
   * 获取一级页面触发
   */
  getFristClass: function () {
    var page = this;
    app.request({
      url: 'article_class/index',
      method: 'get',
      // data: {
      //   id: options.id,
      // },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            fristClass:res.data,
          });
          page.getTowClass(res.data[0].id)
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
   * 获取二级页面接口
   */
  getTowClass:function(id) {
    var page = this;
    var id = id;
    app.request({
      url: 'article_class/getLabel',
      method: 'get',
      data: {
        id: id,
      },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          page.setData({
            towClass:res.data,
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
   * 点击一级分类触发事件
   */
  fristTab:function (e) {
    var page  = this;
    var index = e.target.dataset.index;
    if (index==page.data.activeFristIndex) {
      return;
    }
    page.setData({
      activeFristIndex:index,
    });
    var id = page.data.fristClass[index].id;
    page.getTowClass(id);
  },
  /**
   * 前往列表页
   */
  goToList: function (e) {
    var page = this;
    var type = e.currentTarget.dataset.type;
    var label = e.currentTarget.dataset.id;
    console.log(label);
    wx.navigateTo({
      url: '/pages/list/list?type=' + type + "&label=" + label,
    })
  },
})