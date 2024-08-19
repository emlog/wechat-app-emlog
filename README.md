# EMLOG 微信小程序

基于emlog pro系统API开发

## 主要功能

- 文章列表
- 文章阅读
- 文章分类查看
- 文章搜索
- 个人介绍页

## 演示

![wechat_app.png](https://img.gugu.ovh/i/2024/08/19/153632.webp)

## 使用须知

- 下载安装部署 [emlog](https://emlog.net)，并开启api（系统-设置-api-开启api）
- 微信小程序使用api必须是https，因此需要自己的博客网站配置ssl证书。
- 下载后直接使用【微信开发工具工具】打开即可调试和发布。
- 在 miniprogram 目录app.js配置api密钥以及线上api地址等信息

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
