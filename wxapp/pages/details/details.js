// pages/details/details.js
var app = getApp();
var wxParse = require('../../wxParse/wxParse.js');
var Base64 = require('js-base64').Base64;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsImg:[],
    show_comment:false,
    commentText:'',
    commentId:0,
    c_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

    var page = this;
    page.getDetailsInfo(options);


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
    var page = this;
    var options = {id:page.data.data.id};
    page.getDetailsInfo(options);

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
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
   * 获取贴详情
   */
  getDetailsInfo: function (options) {
    var page = this;
    var options = options;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    app.request({
      url: 'index/details',
      method: 'get',
      data: {
        id: options.id,
      },
      success: function (res) {
        console.log("-------------detail data---------------")
        console.log(res);

        res.data.posts_content = Base64.decode(res.data.posts_content);
        res.data.posts_title = Base64.decode(res.data.posts_title);

        if (res.code == 0) {

          var posts_content = res.data.posts_content;
          wxParse.wxParse("detail", "html", posts_content, page);
          page.setData({
            detailsImg:res.data.imgList,
            data:res.data,
          });
          // 获取评论
          page.getDetailsComment(res.data.id);
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 500);
      }
    });
  },  
  /**
   * 获取贴评论
   */
  getDetailsComment: function (id) {
    var page = this;
    var post_id = id;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    app.request({
      url: 'comment/getComments',
      method: 'get',
      data: {
        post_id: post_id,
      },
      success: function (res) {
        
        console.log(res.data);

        for(var i in res.data){
          res.data[i].content=Base64.decode(res.data[i].content);
        }
        if (res.code == 0) {
          page.setData({
            comments : res.data,
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 500);
      }
    });
  },
  /**
   * 显示评论
   */
  showCoemment:function(e){
    var id = e.currentTarget.dataset.id;
    var c_id = e.currentTarget.dataset.id;
    var page = this;
    if (id == page.data.commentId){
      page.setData({
        show_comment: true,
        commentId: id,
        c_id: c_id,
      });
    }else{
      page.setData({
        show_comment: true,
        commentId: id,
        c_id: c_id,
        commentText:''
      });
    }

  },
  /**
   * 隐藏评论
   */
  hiddCommentPlay:function(){
    this.setData({
      show_comment: false,
    });
  },
  /**
   * 评论框输入内容
   */
  commentTixtTab:function(e) {
    var page = this;
    var commentText = e.detail.value;
    this.setData({
      commentText: commentText,
    });
  },
  /**
   * 发送评论
   */
  sendCommentText:function(e) {
    console.log("发送评论");
    var page = this;
    var commentText = Base64.encode(page.data.commentText);
    var to_pid = page.data.c_id;
    //console.log(commentText);
    if(commentText==''){
      wx.showModal({
        title: '错误',
        content: '评论内容不能为空',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          }
        }
      });
      return;
    }
    wx.showLoading({
      title: '发送中',
      mask: true,
    });
    app.request({
      url: 'comment/postComment',
      method: 'POST',
      data: {
        post_id: page.data.data.id,
        content: commentText,
        to_pid: to_pid,
        to_uid: page.data.commentId
      },
      success: function (res) {
        console.log("评论发送成功");
        if (res.code == 0) {
          var options = { id: page.data.data.id };
          page.getDetailsInfo(options);
          // page.setData({
          //   comments: res.data,
          // });
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        this.onLoad();
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 500);
      }
    });
  },
  /**
   * 收藏贴
   */
  saveCollection:function(e){
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.request({
      url: 'collection/getCollection',
      method: 'GET',
      data: {
        post_id: page.data.data.id,
      },
      success: function (res) {
        //console.log(res);
        if (res.code == 0) {
          var data = page.data.data;
          data.collection = true;
          page.setData({
            data: data,
          });
          wx.showToast({
            title: '收藏成功',
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
                //console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 500);
      }
    });
  },
  /**
   * 前往列表页
   */
  goToList: function (e) {
    var page = this;
    var type = e.currentTarget.dataset.type;
    var label = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/list/list?type=' + type + "&label=" + label,
    })
  },
  /**
   * 点赞
   */
  saveLike:function (e){
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.request({
      url: 'collection/setLike',
      method: 'GET',
      data: {
        post_id: page.data.data.id,
      },
      success: function (res) {
        console.log("zzzzzzzzzz   "+res);
        if (res.code == 0) {
          /*var data = page.data.data;
          data.like = true;
          page.setData({
            data: data,
          });*/
          wx.showToast({
            title: '点赞成功',
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
                //console.log('用户点击确定')
              }
            }
          })
        }
      },
      complete: function () {
        setTimeout(function () {
          // 延长一秒取消加载动画
          wx.hideLoading();
        }, 500);
      }
    });
  },
  /**
 * 查看大图
 */
  showBigImages: function (e) {
    var page = this;
    var key = e.currentTarget.dataset.key;
    wx.previewImage({
      current: page.data.detailsImg[key], // 当前显示图片的http链接
      urls: page.data.detailsImg // 需要预览的图片http链接列表
    });
  },
  /**
   * 返回首页
   */
  goToHome: function (e) {
    // wx.redirectTo({
    //   url: '/pages/index/index'
    // })
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 前往打赏页
   */
  goToAppreciate:function(e){
    var page = this;
    wx.navigateTo({
      url: '/pages/appreciate/appreciate?id=' + page.data.data.id,
    })
  },
  /**
   * 前往打赏列表
   */
  goToAppreciateList:function(e){
    var page = this;
    wx.navigateTo({
      url: '/pages/appreciate-list/appreciate-list?id=' + page.data.data.id,
    })
  }
})