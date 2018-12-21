// pages/getup/getup.js
const app = getApp()

var openid = ''
var nickName = ''
var avatarUrl = ''
var message = ''
var gender = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onload")
    var that = this
    // get openid
    wx.cloud.callFunction({
      name: 'openid',
      success(res) {
        console.log("getopenid")
        openid = res.result.openid

        // find if user exists
        const db = wx.cloud.database()
        db.collection('users').where({
            _openid: openid
          })
          .get({
            success(res) {
    
              console.log(res.data)
              var ymy=res.data.length
    
              wx.getUserInfo({
                success: function(res) {
                  var userInfo = res.userInfo
        
                  console.log(userInfo.nickName)
                  
                  //write in 
                  nickName = userInfo.nickName
                  avatarUrl = userInfo.avatarUrl
                  gender = userInfo.gender

                  that.setData({
                    disabled:false
                  })
                  // If not find the user then create one
                  if (ymy == 0) {
                    // write in cloud
                    const db = wx.cloud.database()
                    db.collection('users').add({

                      data: {
                        nickName: userInfo.nickName,
                        avatarUrl: userInfo.avatarUrl,
                        gender: userInfo.gender, //性别 0：未知、1：男、2：女
                        province: userInfo.province,
                        city: userInfo.city,
                        country: userInfo.country,
                        createTime: Date()
                      },
                      success(res) {
                        //console.log(res)
                      }
                    })
                  }
                }
              })

            }
          })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // I get up!
  getup: function(e) {

    const that = this;
    const db = wx.cloud.database()
    db.collection('getup').add({

      data: {
        nickName: nickName,
        avatarUrl: avatarUrl,
        gender: gender, //性别 0：未知、1：男、2：女
        message: message,
        time: Date()
      },
      success(res) {
        //console.log(res)
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  input: function(e) {
    message = e.detail.value;
  }
})