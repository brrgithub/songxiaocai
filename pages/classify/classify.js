// pages/classify/classify.js
const app = getApp()
const fetch = app.fetch
const categoryHeight = [] // 右列表各分类高度数组
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catelist:[],
    // catebtncss:"display:block; width: 100%;height: 50px;line-height: 50px;background-color: #fff;font-size: 16px;font-weight:500; padding:  0;border-radius: 10px;",
    // clickcatecss:"background-color: #F0F0F0;color: #42CF6B;display:block; width: 100%;height: 50px;line-height: 50px;background-color: #fff;font-size: 16px;font-weight:500; padding:  0;border-radius: 10px;",
    currentItem:"",
    activeIndex: 0,
    tapIndex: 0,
    changingCategory: false,
    promotion: {},
    screenHeight:0,   //当前屏幕高度
    ifclickcate:false,   //检测是否进行点击了左侧边栏的菜单
    ifscollBottom:false,   //检测是否滚动到页面的最底部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    var sysInfo = wx.getSystemInfoSync();
    fetch('classifydata').then(data=>{
      wx.hideLoading()
      for (var i in data) {
        that.setData({
          activeIndex: i
        })
        break
      }
      that.setData({
        catelist:data,
        screenHeight: sysInfo.windowHeight
        // promotion: data.promotion[0]
      }, () => {
        var query = wx.createSelectorQuery()
        var top = 0
        query.select('.good').boundingClientRect(rect => {
          top = rect.top
        })
        query.selectAll('.good-cate').boundingClientRect(res => {
          res.forEach(rect => {
            categoryHeight[rect.id.substring(rect.id.indexOf('_') + 1)] = rect.top - top
          })
        })
        query.exec()
      })
    },()=>{
      that.onLoad()
    })
  },
  // 点击左侧菜单
  tapCategory: function(e) {
    var index = e.currentTarget.dataset.index
    console.log(index,"inefx----------")
    
    this.changingCategory = true
    this.setData({
      activeIndex: index,
      tapIndex: index,
    }, () => {
      this.changingCategory = false
    })
    // 除了第一个菜单   点击其他菜单 ifclickcate均为true
    if (index != 0){
      this.setData({
        ifclickcate:true
      })
    }
  },
  // 滚动右侧
  ongoodScroll: function(e) {
    var scrollTop = e.detail.scrollTop
    // console.log(scrollTop,"scrolltolower",categoryHeight)
    var activeIndex = 0
    // 关于左侧边栏点击会跳转到上一个按钮的bug    监听点击事件  如果点击了左侧边的菜单  ifclickcate=true  如果是滚动的话那么ifclickcate=false
    // 如果ifclickcate=true的话  activeIndex = i+1  否则activeIndex = i(滑动到最底部那个bug也是这种解决方法)
    categoryHeight.forEach((item, i) => {
      if (scrollTop >= item) {
        // console.log(this.data.ifscollBottom,"this.data.ifscollBottom---------------")
        if (this.data.ifclickcate == true){
          activeIndex = i+1
        }else if(this.data.ifscollBottom == true){
          activeIndex = 7
        }else{
          activeIndex = i
        }
      }
    })
    if (!this.changingCategory) {
      this.changingCategory = true
      this.setData({
        activeIndex: activeIndex,
        ifclickcate:false,
        ifscollBottom:false
      }, () => {
        this.changingCategory = false
      })
    }
  },
  // 滚动到最底部
  scrolltolower: function() {
    // console.log(categoryHeight.length-1,"categoryHeight.length-1---------------")
    this.setData({
      ifscollBottom:true,
      activeIndex: categoryHeight.length-1
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

  }
})