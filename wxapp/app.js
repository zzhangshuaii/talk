//app.js
var url = 'http://evan.tunnel.qydev.com/we7local/addons/sl_wforum/tp/public/index.php/api/';
var store_id = 1;
App({
  onLaunch: function () {
    this.setApi();
    this.getUserInfo(this);
  },
  onShow: function () {

    this.login();
  },
  /**
   * 获取用户信息逻辑操作
   * 请求接口换取用户token和用户在本站存储的用户信息
   */
  getUserInfo: function (cb) {
    var page = this;
  },
  // 微信登录
  login: function () {
    wx.checkSession({
      success: function () {
        var token = wx.getStorageSync('token');
        if (!token) {
          getApp().login_1();
        }
      },
      fail: function () {
        getApp().login_1();
      }
    });
  },
  login_1: function () {
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var userInfo = {};
              userInfo.userInfo = res.userInfo
              userInfo.encryptedData = res.encryptedData;
              userInfo.iv = res.iv;
              userInfo.signature = res.signature;
              userInfo.code = code
              userInfo.raw_data = res.rawData,
                wx.request({
                  url: url + 'login/login?store_id=' + store_id,
                  data: userInfo,
                  method: "POST",
                  header: { "Content-Type": "application/x-www-form-urlencoded" },
                  success: function (res) {
                    if (res.statusCode == 200 && res.data.code == 0) {
                      console.log(res.data.data.token);
                      wx.setStorageSync('token', res.data.data.token);  // 将用户登录返回token 存储本地
                      wx.setStorageSync('userinfo', res.data.data.userinfo);  // 将用户登录返回用户信息存储本地
                      wx.reLaunch({
                        url: '/pages/index/index',
                        success:function(res){
                          console.log(res);
                        }
                      })
                    } else if (res.statusCode == 200 && res.data.code == 2){
                      getApp().login_1();
                    } else {
                      wx.showToast({
                        title: '登录错误',
                        image: "/images/longing-error.png",
                      });
                      console.log(res);
                    }
                  },
                  // complete: function (res) {
                  //   wx.hideLoading();
                  // }
                })
            },
            fail: function (e) {
              wx.hideLoading();
              getApp().getauth({
                content: '需要获取您的用户信息授权，请到小程序设置中打开授权',
                cancel: true,
                success: function (e) {
                  if (e) {
                    getApp().login();
                  }
                },
              });
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  // 跳转封装
  redirect: function (url, param) {
    wx.navigateTo({
      url: '/pages/' + url + '?' + param
    })
  },
  getauth: function (object) {
    wx.reLaunch({
      url: '/pages/login/login',
      success: function (res) {
        console.log(res);
      }
    })
  },
  request: function (obj) {
    console.log(obj.data);
    var token = wx.getStorageSync('token');
    // obj.data._uniacid = this.siteInfo.uniacid;
    // obj.data._acid = this.siteInfo.acid;
    wx.request({
      url: url + obj.url + '?store_id=' + store_id + '&token=' + token,
      data: obj.data,
      method: obj.method,
      // header: { "Content-Type": "application/x-www-form-urlencoded" },
      // header: {
      //   'content-type': 'application/json' // 默认值
      // },
      success: function (res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          typeof (obj.success) == 'function' && obj.success(res.data);
        } else {
          wx.showToast({
            title: res.data.msg,
            image: "/images/longing-error.png",
          });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: res.errMsg,
          image: "/images/longing-error.png",
         
        });
        //console.log(res.msg);
        if (obj.fail)
          obj.fail(res);
        // }
      },
      complete: function (res) {
        if (obj.complete)
          obj.complete(res);
      }
    })
  },
  siteInfo: require('siteinfo.js'),
  setApi: function () {
    var siteroot = this.siteInfo.siteroot;
    siteroot = siteroot.replace('app/index.php', '');
    siteroot += 'addons/sl_wforum/tp/public/index.php/api/';
    url = siteroot;
    store_id = this.siteInfo.uniacid;
  },
  getUrl:function(){
    return url;
  }
  
})