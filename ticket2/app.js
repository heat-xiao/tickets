import api from 'utils/api.js'

/**
 * 用户信息结构如下：
 * {
    "resultStatus": true,
    "resultData": {
      "openId": "oIvAX0cnn6RyBV_BsH9_ApKuB-rk",
      "nickName": "耀武",
      "gender": 1,
      "language": "zh_CN",
      "city": "Shenzhen",
      "province": "Guangdong",
      "country": "CN",
      "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/PuSoyDUJ5bfsMfGkTtdmh9Kokg72lPgiaD5beXfiatJ8KNQ1iapdxe8jz1k6yPDicOLlLor6ba0WDQThzCTcPtoJ6g/0",
      "watermark": {
        "timestamp": 1482227502,
        "appid": "wxdc4cb6cff2a638ef"
      },
      "accountId": 4
    }
  }
*/

App({
  onLaunch: function () {
    

    // 小程序启动首先需要获取用户信息
    // 首先获取缓存的用户信息
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      
      console.log(userInfo);
      return
    }

    // 缓存不存在，则需要login
    wx.login({
      success: function (r0) {
        console.log('wx login result', r0);
        // 根据code获取用户信息，
        api.getUserInfoBycode({
          data: {
            code: r0.code
          },
          success: function (r1) {
            console.log('code info:', r1.data)
            //  判断用户是否首次登录，若是还需要进一步获取用户信息的密文然后提交服务端解密
            if (!r1.data.resultData.accountId) {
              console.log('first login');
              // 获取用户信息
              wx.getUserInfo({
                success: function (r2) {
                  api.UserRegister({
                    method: 'POST',
                    data: {
                      encryptedData: r2.encryptedData,
                      openId: r1.data.resultData.openId,
                      iv: r2.iv
                    },
                    success: function (r3) {
                      console.log('register success:', r3.data)
                      // 将用户信息存入缓存(数据结构如上注释)
                      wx.setStorageSync('userInfo', r3.data.resultData);
                    }
                  })
                }
              })
            }
            else {
              // 将用户信息存入缓存
              console.log('已经注册过了', r1.data.resultData);
              wx.setStorageSync('userInfo', r1.data.resultData);

            }
          }
        })

      }
    })
    console.log('小程序启动完成了~~~');
    
    //获取系统配置
    api.getSysconfig({
      url: `?q=REFUND_INTRODUCE,VALIDATE_IDENTITY,INSURANCE_PRICE`,
      success: (res) => {
        if (res.data && res.data != {}) {      
          wx.setStorageSync('configInfo', res.data.resultData);
        }
      }
    });

  },

  globalData: {
    userInfo: null,
    systemInfo: null,
    restServer: "https://xcxhn.30days-tech.com/ticket_node/v1"
  }

})