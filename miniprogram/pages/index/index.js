//index.js

const app = getApp()

Page({
    data: {
        swiperIndex: 0,
        swiperHeight: 130,
        postersShow: false, //海报弹窗
        imgSuccess: true, //海报制作是否成功
        userInfo: {},
        authorInfo: {}, //作者信息
        hasUserInfo: false,
        logged: false,
        takeSession: false,
        requestResult: '',
        articleTopList: [], //文章信息 阅读量最高
        articleList: [], //文章信息  
        page: 1, //当前请求数据是第几页
        pageSize: 6, //每页数据条数
        hasMoreData: true, //上拉时是否继续请求数据，即是否还有更多数据
        list: app.list, // 自定义tabbar
        capsuleBarHeight: app.capsuleBarHeight,
        globalData: app.globalData,
        index_skeleton_show: true, //首页骨架屏
        index_skeleton_show_history: true, //历史上的今天骨架
        customeSlugListOne: [], //自定义分类加载列表 -- 第一个
    },
    onShow: function () {
        this.setData({
            globalData: app.globalData
        })
    },
    onReady: function () {

    },

    onLoad: function () {
        this.initParams()
        this.loadLastestArticles();
        this.loadTopArticles();
    },
    //增加分享屏幕
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: app.globalData.shareName,
            path: '/pages/index/index'
        }
    },
    onShareTimeline() {
        return {
            title: app.globalData.shareName,
            path: '/pages/index/index'
        }
    },

    // 轮播组件监听
    bindchange(e) {
        this.setData({
            swiperIndex: e.detail.current
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // 初始化查询参数
        this.initParams()
        // 获取文章列表（最新）
        this.loadLastestArticles();
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.hasMoreData) {
            this.loadLastestArticles();
        } else {
            wx.showToast({
                title: '没有更多数据',
                image: '../../images/noneData.png',
                duration: 2000
            })
        }
    },
    // 初始化参数
    initParams() {
        this.setData({
            page: 1,
            pageSize: 8,
            articleList: [],
        })
    },

    removeHtmlTags(str) {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    },

    // 文章列表追加
    appendArticleList(resList) {
        resList.forEach(item => {
            // 移除HTML标签
            item.description = this.removeHtmlTags(item.description);

            // 如果 description 长度大于 50，截取前 50 个字符并加上省略号
            if (item.description.length > 50) {
                item.description = item.description.substring(0, 50) + '...';
            } else {
                item.description = item.description;
            }
        });
        let allPageArticleList = this.data.articleList;
        if (resList.length < this.data.pageSize || resList.length == 0) {
            this.setData({
                articleList: allPageArticleList.concat(resList),
                hasMoreData: false
            })
        } else {
            this.setData({
                articleList: allPageArticleList.concat(resList),
                hasMoreData: true,
                page: this.data.page + 1
            })
        }
    },

    // load  lastest  article
    loadLastestArticles() {
        const that = this;
        wx.showLoading({
            title: '加载中',
        })
        const page = that.data.page;
        const count = that.data.pageSize;
        wx.request({
            url: app.globalData.baseUrl + 'article_list&page=' + page + '&count=' + count,
            method: 'GET',
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 0) {
                    that.setData({
                        index_skeleton_show: false
                    })
                    that.appendArticleList(res.data.data.articles)
                } else {
                    console.log("数据加载异常")
                }
            },
            fail: function (res) {
                console.log("请求异常", res)
                wx.hideLoading()
            }
        })
    },

    //load  top  article
    loadTopArticles() {
        const that = this;
        const page = 0;
        const count = 3;
        wx.request({
            url: app.globalData.baseUrl + 'article_list&page=' + page + '&count=' + count + '&order=views',
            method: 'GET',
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        articleTopList: res.data.data.articles,
                    })
                }
            },
            fail: function (res) {
                console.log("请求异常", res)
            }
        })
    },


    // 文章详情页面
    toArticleDetail(data) {
        const articleId = data.currentTarget.dataset.articleItem.id;
        let url = '/pages/article/article?articleId=' + articleId;
        wx.navigateTo({
            url: url,
        })
    },

    // 商品页面
    toGoodsPage() {
        wx.navigateTo({
            url: '/pages/goods/goods',
        })
    },

    urlValidateUtil(url) {
        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(Expression);
        return objExp.test(url);
    },

    /**
     * 留言页面
     */
    toMessageBoardPage() {
        wx.navigateTo({
            url: '/pages/message-board/message-board',
        })
    },

    /**
     * 点击搜索框触发
     */
    toAllArticleList() {
        wx.switchTab({
            url: '/pages/history/history',
        })
    },

    // 跳转第三方话费充值小程序
    toPddMiniprogram() {
        let params_str = '?apiKey=' + app.globalData.third_apikey_coupons + '&positionId=' + app.globalData.privateId_coupons;
        wx.request({
            url: app.globalData.third_baseUrl_coupons + '/app/front/api/phone/bribe/v2' + params_str,
            method: 'post',
            success: function (res) {
                console.log(res)
                wx.navigateToMiniProgram({
                    appId: res.data.data.we_app_info.app_id,
                    path: res.data.data.we_app_info.page_path,
                    success: function (res) {
                        console.log(res);
                    },
                    fail: function (err) {
                        console.log(err);
                    }
                })
            },
            fail: function (err) {
                console.error(err);
                wx.showToast({
                    title: '获取失败',
                    icon: 'none'
                })
            }
        })
    },
})