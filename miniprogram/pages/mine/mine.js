// miniprogram/pages/mine/mine.js
const app = getApp()
import Dialog from '../../components/vant/components/dist/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        authorInfo: {},
        globalData: app.globalData,
        loading: false, //全屏加载
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.loadUserInfo()
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
    showMyToast(title, type) {
        if (type === 'success') {
            wx.showToast({
                title: title,
                duration: 3000,
                image: '../../images/validateSuccess.png'
            })
        } else if (type === 'fail') {
            wx.showToast({
                title: title,
                image: '../../images/validateError.png'
            })
        }
    },
    popupMessage(message, type) {
        wx.lin.showMessage({
            top: 60,
            duration: 4000,
            type: type,
            content: message
        })
    },
    //user info 
    loadUserInfo() {
        const userInfo = {
            nickname: app.globalData.author_name,
            avatar: app.globalData.author_avatar,
            description: app.globalData.author_bio,
        };
        this.setData({
            authorInfo: userInfo,
        });
    },
    showAbout() {
        Dialog.alert({
            title: '温馨提示',
            message: app.globalData.about_info
        }).then(() => {
            // on close
        });
    },
    doCopyDomain() {
        wx.setClipboardData({
            data: app.globalData.domain,
            success: function (res) {
                console.log("复制内容", app.globalData.domain)
            }
        })
    },
})