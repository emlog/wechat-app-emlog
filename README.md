# EMLOG 微信小程序

基于 emlog pro 的系统API开发的微信小程序，完全开源，免费下载部署。

## 主要功能

- 文章列表
- 文章阅读
- 分类查看
- 文章搜索
- 个人介绍

## 演示

![wechat_app.png](https://img.gugu.ovh/i/2024/08/19/153632.webp)

## 使用须知

- 下载安装部署 [emlog](https://emlog.net)，并开启api（系统-设置-api-开启api）
- 微信小程序使用api必须是https，因此需要自己的博客网站配置ssl证书。
- 下载小程序安装包，解压后直接使用【[微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)】打开即可调试和发布。
- 在 miniprogram 目录app.js配置api密钥、api地址、小程序名称、介绍等信息

## 备案和认证

- 需要在微信小程序后台完成备案，不备案无法通过审核。
- 需要完成付费认证（每年300），认证后的小程序才可以正式发布，被其他用户搜索和使用，否则只能自己体验测试。
- 提交审核前，推荐小程序设置主营类目：（咨询 - 信息咨询）

## 相关配置说明

配置文件：miniprogram 目录 app.js

```js
this.globalData = {
            domain: 'https://demo.emlog.cn', // 博客站点域名，必须配置好https
            baseUrl: 'https://demo.emlog.cn/?rest-api=', //api url，开启api后替换为你自己的域名
            api_access_key: "xxxxx", //api密钥 在emlog后台系统-设置-api 设置界面可以找到
            empty_img: "/images/cover.png", // 默认的文章封面图
            empty_avatar: "/images/avatar.png", // 默认的用户头像
            title: "hello world", // 小程序标题
            shareName: 'hello world', // 小程序分享名称
            author_name: 'snow', // 个人页：作者名称
            author_avatar: '/images/avatar.png', // 个人页：作者头像
            author_bio: 'hello world', // 个人页：作者介绍
            about_info: '基于开源博客emlog提供的API开发',
        }
```

## License

MIT
