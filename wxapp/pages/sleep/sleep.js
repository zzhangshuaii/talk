// pages/getup/getup.js
const app = getApp()

var openid = ''
var nickName = ''
var avatarUrl = ''
var message = ''
var gender = 0

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    signin: "点击签到",
    getuplist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    var that = this
    // get openid
    wx.cloud.callFunction({
      name: 'openid',
      success(res) {
        console.log("getopenid")
        openid = res.result.openid

        // find if user exists

        db.collection('users').where({
          _openid: openid
        })
          .count({
            success(res) {

              console.log(res.total)
              var ymy = res.total

              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo

                  console.log(userInfo.nickName)

                  //write in 
                  nickName = userInfo.nickName
                  avatarUrl = userInfo.avatarUrl
                  gender = userInfo.gender

                  // that.setData({
                  //   disabled:false
                  // })
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
                        createTime: db.serverDate()
                      },
                      success(res) {
                        //console.log(res)
                      }
                    })
                  }

                  // cheack get up
                  that.checkgetup();
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this
    // get getup list
    var t = new Date()
    t.setHours(0)
    t.setMinutes(0)
    t.setSeconds(0)

    const _ = db.command
    db.collection('sleep')
      .where({
        time: _.gt(t)
      })
      .orderBy('time', 'desc')
      .get({
        success(res) {

          console.log("sleep list")
          console.log(res.data)

          // simplify the time
          res.data.forEach(item => {
            var tt = item.time
            item.simpletime = tt.getHours() + '点' + tt.getMinutes() + '分' + tt.getSeconds() + '秒'
          })

          that.setData({
            getuplist: res.data
          })
        }
      })
    this.checkgetup()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // get getup list

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

  // I get up!
  getup: function (e) {

    const that = this;
    const db = wx.cloud.database()
    db.collection('sleep').add({

      data: {
        nickName: nickName,
        avatarUrl: avatarUrl,
        gender: gender, //性别 0：未知、1：男、2：女
        message: message,
        time: db.serverDate()
      },
      success(res) {
        //console.log(res)
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
        that.onShow()
      }
    })
  },

  input: function (e) {
    message = e.detail.value;
  },

  checkgetup: function () {

    var that = this
    var t = new Date()

    if (t.getHours() >= 20) {

      that.setData({
        signin: "还未开始"
      })
      return
    }
    if (t.getHours() >= 5) {

      that.setData({
        signin: "今日已结束"
      })
      return
    }

    t.setHours(0)
    t.setMinutes(0)
    t.setSeconds(0)
    // console.log("checkgetup")
    // console.log(Date())
    const _ = db.command
    db.collection('sleep')
      .where({
        _openid: openid,
        time: _.gt(t)
      })
      .count({
        success(res) {

          console.log(res.total)

          if (res.total == 0) {
            that.setData({
              disabled: false
            })
          } else {
            that.setData({
              signin: "已签到",
              disabled:true
            })
          }
        }
      })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    this.onShow()

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }

})