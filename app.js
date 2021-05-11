// app.js

App({
  // data:{
  //   storelist:[]
  // },
  fetch: require('./utils/fetch'),
  globalData: {
    userInfo: null,
    storelist:["00"],
    storeshow:true,
    nochoose:true,
    choose:false,   
    useless:false  //sessionkey是否过期
  },
  // 排序方法封装
  compare(property, bol) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      if(bol){
        return value1 - value2;
      }else {
        return value2 - value1;
      }
    }
  },
  //  封装检查微信登录状态是否过期
  checkWXlsession(){
    let that = this
    wx.checkSession({
      success () {
        console.log("00099")
        //session_key 未过期，并且在本生命周期一直有效
        if (that.ifwxLogin) {
            that.ifwxLogin(true)
            console.log("0000000000")
        }
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        if (that.ifwxLogin) {
            that.ifwxLogin(false)
        }
      }
    })
  },
  // 把用户的头像信息赋值
  setuserimg(){
    console.log("进入函数")
    if (this.dd) {
      this.dd(wx.getStorageSync('avatarUrl'))
      console.log(wx.getStorageSync('avatarUrl'),"用户的头缓存")
    }
  },
  // 检查用户之前是否登录过
  checkLogin(){
    //  判断用户之前是否登录过 以及登录状是否失效
    let sessionkey = wx.getStorageSync("sessionkey")
    let that = this
    if (sessionkey){
      // sessionkey不为空   判断sessionkey是否过期
      wx.checkSession({
        success () {
          console.log("sessionkey没有过期   直接自动登录")
          if (that.setUserImgdata) {
            that.setUserImgdata(true)
          }
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          // wx.login() //重新登录
          console.log("sessionkey过期   显示登录注册")
          if (that.setUserImgdata) {
            that.setUserImgdata(false)
          }
        }
      })
    }else{
      // sessionkey为空  显示登录注册
       console.log("sessionkey为空  显示登录注册 ")
    }
  },
  onLaunch() {
    this.checkLogin()
    // this.checkWXlsession()
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
       var latitude = res.latitude//维度
       var longitude = res.longitude//经度
      //  that = this
       // 把经纬度存在缓存里
       wx.setStorage({
          key:"latlog",
          data:[latitude,longitude]
        })
       wx.request({
         url: 'https://rong.jujiaoweb.com/location',
         data: {
          latitude:res.latitude,
          longitude:res.longitude
         },
         method:"GET",
         header: {
          'content-type': 'application/x-www-form-urlencoded'
         },
         success(lores){
          console.log("进入请求档口函数---")
          //  判断之前有没有选择过档口
          wx.getStorage({
            key: 'choosestore',
            success (res) {
              console.log(res,"之前选择过档口")
              // console.log("刷新",wx.getStorage('choosestore'))
              // 之前选择过档口   则直接显示首页
              if (that.ifchooseStore) {
                  that.ifchooseStore([false,true])
              }
            },
            fail(){
              console.log("之前没有选择过档口")
              // 之前没有选择过档口  则显示选择档口的页面  显示 档口的为true  显示首页的为false
              if (that.ifchooseStore) {
                  that.ifchooseStore([true,false])
              }
              // 根据距离我的位置进行排序
              lores.data.forEach(function(item, index){
                console.log(item); 
                console.log(index); 
                // property   根据数据中的哪个键进行排序的。
                var property = "distance";
                var arr = lores.data;
                var sortRule = true; // 正序倒序
                console.log(arr.sort(that.compare(property, sortRule)),"===排序")
                console.log(that.userInfoReadyCallback,"that.userInfoReadyCallback========")
                if (that.userInfoReadyCallback) {
                   that.userInfoReadyCallback([arr.sort(that.compare(property, sortRule)),true])
                }
              })
            }
          })
         },
         fail(){
           console.log("没有进入请求档口函数---")
         }
       })
      }
     })
     
    
    
  },
})
