// miniprogram/pages/article/article.js

import Card from '../common/card';
import MpCuConfig from '../common/mp-custom-config'
let videoAd = null;

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        postersShow: false, //海报弹窗
        imgSuccess: true, //海报制作是否成功
        articleDetail: {},
        //文章信息
        articleId: undefined,
        status: undefined,
        password: undefined,
        showSkeleton: true, //骨架屏
        passwordDialog: false, //密码输入框
        inputPwd: "", //用户输入的密码(私密文章)
        globalData: app.globalData,
        capsuleBarHeight: app.capsuleBarHeight, //顶部高度
        comments: [], //评论
        userInfo: undefined,
        authorInfo: undefined,
        actionSheetShow: false,
        myComment: undefined,
        email: "",
        currentComment: undefined, //选中的当前评论
        myStyle: { //自定义mp主题

        },
        maxShowHeight: 1024, // 最大默认显示高度
        cuAd: 'noAd', //默认无广告激励
        showLine: 50, //有广告激励时默认展示文本行数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;

        //mp主题
        this.setData({
            myStyle: new MpCuConfig("default").defaultConfig().myStyle
        })
        //初始化变量
        that.setData({
            articleId: options.articleId,
        })

        // 骨架屏显示
        setTimeout(function () {
            that.setData({
                showSkeleton: false,
            })
        }, 2000)

        this.initArticle(options.articleId)

        // 创建激励视频广告实例
        if (app.globalData.openAd && wx.createRewardedVideoAd) {
            console.log("创建激励视频广告实例")
            videoAd = wx.createRewardedVideoAd({
                adUnitId: app.globalData.unitId2
            })
            videoAd.onLoad(() => {})
            videoAd.onError(() => {})
            videoAd.onClose((res) => {
                if (res.isEnded) {
                    wx.showToast({
                        title: '您已观看完视频，继续阅读吧',
                        icon: 'none'
                    })
                    that.setData({
                        cuAd: 'noAd',
                        maxShowHeight: 100000
                    })
                    app.globalData.currentScanAd = true;
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: '您当前未观看完视频，无法继续阅读',
                        showCancel: true, //是否显示取消按钮
                        confirmText: '确定',
                    })
                }
            })
        }
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
        this.setData({
            globalData: app.globalData
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("hidden")
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

    loadover() {
        console.log("渲染完成")
        wx.hideLoading()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let articleDetail = this.data.articleDetail;
        let path = '/pages/article/article?articleId=' + articleDetail.id + '&status=' + articleDetail.status + '&password=' + articleDetail.password;
        return {
            title: articleDetail.title,
            path: path
        }
    },

    onShareTimeline() {
        let articleDetail = this.data.articleDetail;
        let path = '/pages/article/article?articleId=' + articleDetail.id + '&status=' + articleDetail.status + '&password=' + articleDetail.password;
        return {
            title: articleDetail.title,
            path: path
        }
    },

    showMyToast(title, type) {
        if (type === 'success') {
            wx.showToast({
                title: title,
                image: '../../images/validateSuccess.png'
            })
        } else if (type === 'fail') {
            wx.showToast({
                title: title,
                image: '../../images/validateError.png'
            })
        }
    },

    //初始化文章页面
    initArticle(articleId) {
        this.loadArticleDetail(articleId);
    },

    //返回上一级
    onClickLeft() {
        wx.navigateBack({
            delta: 1
        })
    },

    loadArticleDetail(articleId) {
        const that = this;
        wx.showLoading({
            title: '文章加载中',
        })
        wx.request({
            url: app.globalData.baseUrl + 'article_detail&id=' + articleId,
            method: 'GET',
            success: function (res) {
                if (res.data.code == 0) {
                    let data = JSON.parse(JSON.stringify(res.data.data));
                    that.setData({
                        articleDetail: data.article,
                    })
                    console.log("文章:", data)
                    //that.metaDataValidate(data)
                } else {
                    console.log("文章加载异常")
                }
            },
            fail: function (res) {
                wx.hideLoading()
                console.log("请求异常", res)
            }
        })
    },
    /**
     *  meta data
     */
    metaDataValidate(data) {
        const that = this;
        data.metas.forEach(e => {
            if (!app.globalData.currentScanAd) {
                //showAd
                if (e.key === 'showAd') {
                    if (e.value && e.value === 'true') {
                        that.setData({
                            cuAd: 'showAd',
                            maxShowHeight: 1524,
                        })
                    } else {
                        that.setData({
                            cuAd: 'noAd',
                        })
                    }
                }
                //maxShowHeight
                if (e.key === 'maxShowHeight') {
                    if (e.value && that.data.cuAd == 'showAd') {
                        that.setData({
                            maxShowHeight: parseInt(e.value),
                        })
                    }
                }
            }

            //gzhURL
            if (e.key === 'gzhURL') {
                if (e.value) {
                    that.setData({
                        gzhURL: e.value
                    })
                }
            }
        })
    },
    onImgOK(e) {
        this.setData({
            imgSuccess: false
        })
        this.imagePath = e.detail.path;
        this.setData({
            image: this.imagePath
        })
        if (this.isSave) {
            this.saveImage(this.imagePath);
        }
    },
    saveImage() {
        if (this.imagePath && typeof this.imagePath === 'string') {
            this.isSave = false;
            wx.saveImageToPhotosAlbum({
                filePath: this.imagePath,
            });
        }
    },

    onClickHide() {
        this.setData({
            actionSheetShow: false
        });
    },

    // 阅读更多
    readMoreInfo() {
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(() => {
                        console.log('激励视频 广告显示失败')
                    })
            })

        }
    },
    unfolding(e) {
        if (e.currentTarget.dataset.activeMask) {
            if (e.currentTarget.dataset.activeMask === 'active') {
                this.setData({
                    unfolding: 'unactive'
                })
            } else {
                this.setData({
                    unfolding: 'active'
                })
            }
        } else {
            this.setData({
                unfolding: 'active'
            })
        }
    },

})