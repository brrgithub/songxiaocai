// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    goodlist:[],
    recommendList:[
      {
        imgsrc:"../img/goods.png",
        title:"胡萝卜(袋装)",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods2.png",
        title:"土豆(编织袋)",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods2.png",
        title:"冬瓜",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods.png",
        title:"蒜仔(编织袋)",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods.png",
        title:"红洋葱(袋装)",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods.png",
        title:"油麦菜(泡沫箱)",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods.png",
        title:"小米椒(泡沫箱)",
        detail:"20.0斤装 塑料袋"
      },
      {
        imgsrc:"../img/goods.png",
        title:"5.5红蒜(编制袋)",
        detail:"20.0斤装 塑料袋"
      }
    ],
    storeshow:"",
    storename:"",
    nochoose:"",
    choose:"",
    short:false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // 刷新之后档口显示的内容从缓存读取 
    this.setData({
      storename:wx.getStorageSync('choosestore')
    })
    // 如果检验sessionkey存在而且没有过期的话   我的页面显示用户的头像就为true
    app.setUserImgdata=res=>{
      wx.setStorageSync('showuserImg', res)
    }
    // 刷新页面判断有没有选择档口 决定显示哪个页面
    app.ifchooseStore=res=>{
      console.log(res,"首页显示那个")
      that.setData({
        nochoose:res[0],
        choose:res[1]
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    //设置回调，防止小程序globalData拿到数据为null     
    let that = this;
    app.userInfoReadyCallback=res=>{
      // 显示遮罩层   -----------动画---------
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
        delay: 0
      })
      that.animation = animation
      animation.translateY(300).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: true,
        storelist:res[0],
        storeshow:res[1]
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    }

    // 接收首页的分类菜单信息
    wx.request({
      url: 'https://rong.jujiaoweb.com/classifydata',
      data: {
       
      },
      method:"GET",
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        // console.log(res.data,"接收到的首页的分类信息",typeof(res.data))
        that.setData({
          goodlist:res.data
        })
      }
    })
  },
  // 点击首页左上角档口重新选择档口   点击之后档口选择弹出框显示为true
  // 并且重新和后端对接 获取距离较近的档口
  againChooseStore(){
    let that = this;
    wx.getStorage({
      key: 'latlog',
      success (res) {
        console.log(res.data[0])
        wx.request({
          url: 'https://rong.jujiaoweb.com/location',
          data: {
           latitude:res.data[0],
           longitude:res.data[1]
          },
          method:"GET",
          header: {
           'content-type': 'application/x-www-form-urlencoded'
          },
          success(lores){
            lores.data.forEach(function(item, index){
              console.log(item); 
              console.log(index); 
              // property   根据数据中的哪个键进行排序的。
              var property = "distance";
              var arr = lores.data;
              var sortRule = true; // 正序倒序
              that.setData({
                arr: arr.sort(app.compare(property, sortRule))
              })
              console.log(arr,"===排序")
              if (app.userInfoReadyCallback) {
                 app.userInfoReadyCallback([arr,true])
                  that.setData({
                    storeshow: true
                  })
              }
            })
           
          }
        })
      }
    })
  },
  // 点击选择弹出框某个档口的点击事件
  chooseStore(e){
    // 在点击选择了档口之后  选择档口页面显示为false   首页商品页面显示为true
    this.setData({
      storeshow: false,
      storename:e.target.dataset.name,
      nochoose:false,
      choose:true
    })
    console.log(e.target.dataset.index,"index")
    wx.setStorage({
      key:"choosestore",
      data:this.data.storename
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
