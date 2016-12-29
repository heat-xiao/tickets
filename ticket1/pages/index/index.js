import util from '../../utils/util.js'
Page({
  data: {
    iconUrl: [
      "../../images/tow_icon_order.png",
      "../../images/tow_icon_my.png",
      "../../images/tow_icon_traffic.png",
      "../../images/tow_icon_service.png",
      "../../images/tow_icon_change_blue.png"
    ],
    bannerData:[] ,
    source: wx.getStorageSync('source'),
    destination: wx.getStorageSync('destination'),
    todayDate: new Date(),
    showDate: util.formatTime(new Date()),
    date:new Date()
  },
  
  //切换方向
  toggleDirection : function () {
    var that = this  
    that.setData({
      source: that.data.destination,
      destination: that.data.source
    })   
  },
  
 //时间选择
  bindDateChange: function(e) {
    var that = this
    this.setData({
      showDate:util.formatTime( e.detail.value),
      date:e.detail.value
    })
  },

  onShow: function() {
    var that = this
    that.setData({
      source: wx.getStorageSync('source'),
      destination: wx.getStorageSync('destination')
    })
  },

  // 通过缓存传递参数
  searchTicket : function(e){
    var that = this
    wx.setStorageSync('destination', that.data.destination);
    wx.setStorageSync('source', that.data.source);
    wx.setStorageSync('date',that.data.date);
     wx.navigateTo({
       url: '../tickets/tickets'
     })
  } 
})