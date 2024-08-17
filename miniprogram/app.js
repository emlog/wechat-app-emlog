//app.js
import deviceUtil from "./lin-ui/dist/utils/device-util"
App({
    //自定义bar height
    capsuleBarHeight: deviceUtil.getNavigationBarHeight(),
    onLaunch: function () {
        //校验版本
        this.autoUpdate()

        this.globalData = {
            domain: 'https://demo.emlog.cn', // 博客站点域名，必须配置好https
            baseUrl: 'https://demo.emlog.cn/?rest-api=', //api url，开启api后替换为你自己的域名
            api_access_key: "840d2992f3b2301f73e9f096636b31f7", //api密钥 在emlog后台系统-设置-api 设置界面可以找到
            empty_img: "/images/cover.png", // 默认的文章封面图
            empty_avatar: "/images/avatar.png", // 默认的用户头像
            title: "hello world", // 小程序标题
            shareName: 'hello world', // 小程序分享名称
            author_name: 'snow', // 个人页：作者名称
            author_avatar: '/images/avatar.png', // 个人页：作者头像
            author_bio: 'hello world', // 个人页：作者介绍
            about_info: '基于开源博客emlog提供的API开发',
            // 其他暂时不支持的配置
            openComment: false, // 是否开启评论 true为开启 false为关闭
            openSlideView: false, // 是否开启首页轮播图 true为开启 false为关闭
            index_art_style: 'card01', // 首页最新文章样式 内置：card01/card02
            openAd: false, // 流量主开通则打开
            unitId: 'adunit-x', // 原生模板广告ID  自定义的时候自己可以选择样式
            unitId2: 'adunit-x', // 视频激励广告--用于文章设置观看视频阅读更多功能
        }
    },
    autoUpdate: function () {
        // 版本自动更新代码
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新检测',
                content: '检测到新版本，是否重启小程序？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
                title: '新版本自动更新失败',
                content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索“技术源share”打开',
                showCancel: false
            })
        })
    },
})