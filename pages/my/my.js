// 获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    loginstate: "0",
    show:true,
    isshow:false,
    userInfo:"",
    hasUserInfo:"",
    functionlist:[
      {
        icon:"../img/user/bill.png",
        title:"账单"
      },
      {
        icon:"../img/user/info.png",
        title:"个人信息"
      },
      {
        icon:"../img/user/call.png",
        title:"联系客服"
      },
      {
        icon:"../img/user/suggest.png",
        title:"意见反馈"
      },
      {
        icon:"../img/user/agree.png",
        title:"用户协议"
      },
      {
        icon:"../img/user/photo.png",
        title:"营业资质"
      },
    ],
    avatarUrl:"../img/user/user.png",   //用户没有登录时候的头像
    logincss:"display: inline-block;line-height: 60px;font-size: 20px;margin-left: 60px;",   //登陆注册没有登录前的样式
    nickName:"",  //用户名称,
    isSHowNickname:false    //是否显示用户名称   
  },
  onLoad () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({ openid: res.data });
      },
      fail: function (res) {
        // that.getcode();
      }
    })
    // 判断用户之前登陆是否过期 没有过期的话就显示用户的头像  否则显示初始头像
    if (wx.getStorageSync('showuserImg') == true){
      that.setData({ 
        avatarUrl:wx.getStorageSync('avatarUrl'),
        logincss:"display: inline-block;float: right;margin-right: 10px;font-size: 13px;color: rgb(255,116,14);",
        nickName:wx.getStorageSync('nickName'),
        isSHowNickname:true
      })
    }
  },
  onGotUserInfo: function (e) {
    var that = this;
    console.log("000")
  },
  clickoo(){
    let that = this
    wx.getUserProfile({
      desc: '用于显示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (userinfores) => {
        const userinfo = JSON.parse(userinfores.rawData)
        const nickName = userinfo.nickName
        const city = userinfo.city
        const province = userinfo.province
        const avatarUrl = userinfo.avatarUrl
        const gender = userinfo.gender
        wx.setStorage({
          key:"avatarUrl",
          data:avatarUrl
        })
        wx.setStorage({
          key:"nickName",
          data:nickName
        })
        wx.login({
          success (res) {
            console.log(res,"登录返回数据---")
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://rong.jujiaoweb.com/logindata',
                data: {
                  code: res.code,
                  nickName:nickName,
                  province:province,
                  city:city,
                  gender:gender
                },
                success(openidres){
                  console.log(openidres.data,"sessionkey---")
                  // 把openid存入缓存
                  wx.setStorage({
                    key:"sessionkey",
                    data:openidres.data
                  })
                  // 从缓存中读取头像信息   显示在我的页面
                  const avatarUrl = wx.getStorageSync('avatarUrl')
                  console.log(avatarUrl,"avatarUrl")
                  that.setData({
                    avatarUrl: avatarUrl,
                    logincss:"display: inline-block;float: right;margin-right: 10px;font-size: 13px;color: rgb(255,116,14);",
                    nickName:wx.getStorageSync('nickName'),
                    isSHowNickname:true
                  })
                  console.log(that.data.avatarUrl,"avatarUrl===============")
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true
        // })
      }
    })
  },
  //绑定手机
  getPhoneNumber(e) {
    var that = this;
    that.setData({
      show: (!that.data.show),
      isshow:(!that.data.isshow)
    })
    wx.getUserProfile({
      desc: '用于显示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    console.log(this.data.userInfo)
  },
})