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
        articleId: undefined,
        need_pwd: undefined,
        password: undefined,
        showSkeleton: true, //骨架屏
        passwordDialog: false, //密码输入框
        inputPwd: "", //用户输入的密码
        globalData: app.globalData,
        capsuleBarHeight: app.capsuleBarHeight, //顶部高度
        comments: [],
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
            myStyle: new MpCuConfig().defaultConfig().myStyle
        })
        //初始化变量
        that.setData({
            articleId: options.articleId,
            need_pwd: options.need_pwd,
        })

        // 骨架屏显示
        setTimeout(function () {
            that.setData({
                showSkeleton: false,
            })
        }, 2000)
        if (options.need_pwd === 'y') {
            //展示密码输入框
            that.setData({
                passwordDialog: true,
            })
        } else {
            this.initArticle(options.articleId, '')
        }

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
        let path = '/pages/article/article?articleId=' + articleDetail.id + '&need_pwd=' + articleDetail.need_pwd;
        return {
            title: articleDetail.title,
            path: path
        }
    },

    onShareTimeline() {
        let articleDetail = this.data.articleDetail;
        let path = '/pages/article/article?articleId=' + articleDetail.id + '&need_pwd=' + articleDetail.need_pwd;
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

    // 私密文章密码输入比对
    onValidatePwd() {
        this.initArticle(this.data.articleId, this.data.inputPwd)
    },
    // 监听密码输入
    onChangingPwd(e) {
        this.setData({
            inputPwd: e.detail.value
        })
    },

    //初始化文章页面
    initArticle(articleId, password) {
        this.loadArticleDetail(articleId, password);
        this.loadComments(articleId)
    },

    //返回上一级
    onClickLeft() {
        wx.navigateBack({
            delta: 1
        })
    },

    loadArticleDetail(articleId, password) {
        const that = this;
        wx.showLoading({
            title: '文章加载中',
        })
        wx.request({
            url: app.globalData.baseUrl + 'article_detail&id=' + articleId + '&password=' + password,
            method: 'GET',
            success: function (res) {
                if (res.data.code == 0) {
                    let data = JSON.parse(JSON.stringify(res.data.data));
                    console.log("article data: ", data.article)
                    that.setData({
                        articleDetail: data.article,
                    });
                    // 确认密码有效后关闭密码弹窗
                    if (password) {
                        that.setData({
                            passwordDialog: false
                        });
                    }
                } else {
                    if (password) {
                        that.showMyToast('密码错误', 'fail')
                    }
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

    loadComments(postId) {
        const that = this;
        wx.request({
            url: app.globalData.baseUrl + 'comment_list&id=' + postId,
            method: 'GET',
            success: function (res) {
                console.log("comment data:", res.data.data.comments)
                if (res.data.code == 0) {
                    that.setData({
                        comments: res.data.data.comments
                    })
                }
            },
            fail: function (res) {
                console.log("请求异常", res)
            }
        })
    },

    // 评论按钮事件
    toComment(e) {
        const that = this;
        this.setData({
            currentComment: e.detail.commentItem
        })

        if (app.globalData.userInfo) {
            that.setData({
                actionSheetShow: true,
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '评论需要使用你的微信昵称',
                success(res) {
                    if (res.confirm) {
                        wx.getUserProfile({
                            desc: "获取你的昵称、头像、地区及性别",
                            success: res => {
                                console.log(res)
                                app.globalData.userInfo = res.userInfo;
                                that.setData({
                                    actionSheetShow: true,
                                    userInfo: res.userInfo
                                })

                            },
                            fail: res => {
                                //拒绝授权
                                return;
                            }
                        })
                    } else if (res.cancel) {
                        //拒绝授权 showErrorModal是自定义的提示
                        return;
                    }
                }
            })
        }
    },
    // 提交评论
    saveEvent(e) {
        const that = this;
        if (that.data.myComment !== undefined &&
            that.data.email !== undefined &&
            that.data.myComment.trim() !== "") {
            wx.showLoading({
                title: '评论审核通过后可展示',
            })
            that.doComments();
        } else {
            this.showMyToast('内容不能为空', 'fail')
        }
    },
    //邮箱失焦验证
    validateEmail(e) {
        if (!this.checkEmail(e.detail.value)) {
            this.setData({
                email: ""
            })
        }
    },
    checkEmail(email) {
        let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if (str.test(email)) {
            return true
        } else {
            this.showMyToast('非法邮箱', 'fail')
            return false
        }
    },
    doComments() {
        const that = this;
        let params = {
            "comname": app.globalData.userInfo.nickName,
            "comment": this.data.myComment,
            "commail": this.data.email,
            "pid": this.data.currentComment === undefined ? 0 : this.data.currentComment.id,
            "gid": this.data.articleId,
            "resp": 'json',
        }

        // 将 params 转换为 form-data 格式
        let formData = Object.keys(params).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        wx.request({
            url: app.globalData.domain + '/index.php?action=addcom&api_key=' + app.globalData.api_access_key,
            data: formData, // 使用转换后的 form-data 格式数据
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded' // 设置为 form-data 格式
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 0) {
                    that.loadComments(that.data.articleId);
                    that.setData({
                        actionSheetShow: false
                    });
                    that.showMyToast('评论成功', 'success');
                } else {
                    that.showMyToast('评论失败', 'fail');
                }
            },
            fail: function (res) {
                that.showMyToast('请求异常', 'fail');
                console.log("请求异常", res);
                wx.hideLoading();
            }
        })
    },

})