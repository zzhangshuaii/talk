// pages/post/post.js
const app = getApp();
var my_lable = [16];
var Base64 = require('js-base64').Base64;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[
      // 'http://tmp/wx0f59dddd9c451e50.o6zAJs-w3zWn_9L4azCeTO4711Cg.ddd99145e3f296dae38d231e9bef0328.png',
      // 'http://tmp/wx0f59dddd9c451e50.o6zAJs-w3zWn_9L4azCeTO4711Cg.ff5af99a5b4f1115c9b556f72067b8c5.jpg',
      // 'http://tmp/wx0f59dddd9c451e50.o6zAJs-w3zWn_9L4azCeTO4711Cg.ff5af99a5b4f1115c9b556f72067b8c5.jpg',
      // 'http://tmp/wx0f59dddd9c451e50.o6zAJs-w3zWn_9L4azCeTO4711Cg.ff5af99a5b4f1115c9b556f72067b8c5.jpg',
    ],
    array:[
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    class_name:'选择所属分类',
    title:'',
    content:'',
    towClass:[],
    images:[],
    checked: false
  },

  onChange(event) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: event.detail });
    if(event.detail){
      my_lable=[17];
    }else{
      my_lable[16];
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    page.getClassApi();
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
   * 点击选择图片
   */
  imageBtn:function()
  {
    var page = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var image_list = page.data.imageList.concat(tempFilePaths);
        if (image_list.length > 6){
          wx.showModal({
            title: '提示',
            content: '图片最多只能上传6张',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                return;
              }
            }
          });
          return;
        }
        page.setData({
          imageList: image_list,
        })
        //console.log(tempFilePaths);
        //console.log(res);
      }
    })
  },
  /**
   * 删除图片
   */
  clonsImage:function(e){
    //console.log(e);
    var page = this;
    var key = e.currentTarget.dataset.key;
    //console.log(key);
    var imageList = page.data.imageList;
    // 删除数组中制定元素
    imageList.splice(key, 1);
    page.setData({
      imageList:imageList,
    })
  },
  /**
   * 选择分类
   */
  bindPickerChange:function(e){
    var page = this;
    var index = e.detail.value;
    var fristClass = page.data.fristClass;
    page.setData({
      class_name: fristClass[index]['class_name'],
      class_id: fristClass[index]['id'],
    });
    //console.log(fristClass[index]['id']);
    page.getLabelApi(fristClass[index]['id']);
  },
  /**
   * 查看大图
   */
  showBigImages:function(e){
    var page = this;
    var key = e.currentTarget.dataset.key;
    wx.previewImage({
      current: page.data.imageList[key], // 当前显示图片的http链接
      urls: page.data.imageList // 需要预览的图片http链接列表
    })
  },
  /**
   * 获取标题数据
   */
  placeTitle:function(e){
    var value = e.detail.value;
    var page = this;
    page.setData({
      title:value,
    });
  },
  /**
   * 贴内容获取
   */
  placeContent:function(e){
    var value = e.detail.value;
    var page = this;
    page.setData({
      content: value,
    });
  },
  /**
   * 获取分类
   */
  getClassApi:function(){
    var page = this;
    app.request({
      url: 'article_class/index',
      method: 'get',
      success: function (res) {
        //console.log(res);
        if (res.code == 0) {
          page.setData({
            fristClass: res.data,
          });
          // page.getTowClass(res.data[0].id)
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
        }, 1000);
      }
    });
  },
  /**
   * 获取标签
   */
  getLabelApi:function(id){
    var page = this;
    var id = id;
    wx.showLoading({
      title: '正在获取标签',
      mask: true,
    });
    app.request({
      url: 'article_class/getLabel',
      method: 'get',
      data: {
        id: id,
      },
      success: function (res) {
        //console.log(res);
        if (res.code == 0) {
          page.setData({
            towClass: res.data,
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
        }, 1000);
      }
    });
  },
  /**
   * 选择标签
   */
  selectedLabel:function(e){
    var page = this;
    var index = e.currentTarget.dataset.index;

    var towClass = page.data.towClass;
    if (towClass[index]['selected']== false){
      towClass[index]['selected'] = true;
    } else {
      towClass[index]['selected'] = false;
    }

    page.setData({
      towClass: towClass,
    })
  },
  /**
   * 发表
   */
  postInfo:function(e){
    var page = this;
    var data = {};
    if (!page.data.title){
      //console.log(11);
      wx.showModal({
        title: '错误',
        content: '标题不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    data.title = Base64.encode(page.data.title);
    if (!page.data.content) {
      /*wx.showModal({
        title: '错误',
        content: '内容不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });*/
      page.data.content=" ";
      //return;
    }
    data.content = Base64.encode(page.data.content);

    /*if (!page.data.class_id) {
      wx.showModal({
        title: '错误',
        content: '请选择分类',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }*/
    data.class_id = 14;//page.data.class_id;
    //console.log("------------");
      // console.log(data.class_id);
      /*var label = [];
    for (var c in page.data.towClass){
      if (page.data.towClass[c].selected){
        label.push(page.data.towClass[c].id);
      }
    }
    if (label.length <= 0) {
      wx.showModal({
        title: '错误',
        content: '请选择标签',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }*/
    data.label = my_lable; //label;
    //console.log(data.label);
    var url = app.getUrl();
    var imageList = page.data.imageList;
    if(imageList.length > 0){
      wx.showLoading({
        title: '正在上传图片',
        mask: true,
      });
      var index  = 0
      for(var i in imageList){
        wx.uploadFile({
          url: url +'open/unloadImage',
          filePath: imageList[i],
          name: 'file',
          formData: {
            'user': 'test'
          },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
              //console.log(typeof res);
              
          
            var res = JSON.parse(res.data);
            //console.log(res);
            if (res.code == 0){
              var images = page.data.images.concat(res.data);
              page.setData({
                images: images,
              });
              index++;
              if (index == imageList.length){
                data.images = images;
                page.postASk(data);
              }
            }else{
              wx.showModal({
                title: '错误',
                content: '第' + i + '张图上传失败',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    //console.log('用户点击确定')
                  }
                }
              });
              return;
            }
          },
          fail:function (res) {
            wx.showModal({
              title: '错误',
              content: '第'+i+'张图上传失败',
              showCancel:true,
              success: function (res) {
                if (res.confirm) {
                  //console.log('用户点击确定')
                }
              }
            });
            return;
          }
        });
      }
    }else{
      page.postASk(data);
    }

    
  },
  postASk:function(data){
    var page=this;
    wx.showLoading({
      title: '正在发帖',
      mask: true,
    });
    // 发帖
    app.request({
      url: 'post/post',
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '发表成功',
            icon: 'success',
            duration: 2000
          });
          //page.onShow();
          page.setData({
            input_title: "",
            input_content: ""
          })
          
          wx.switchTab({
            url: '/pages/index/index'
          })
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
          });
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


})