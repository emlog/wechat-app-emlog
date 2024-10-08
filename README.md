# EMLOG 微信小程序

基于 emlog 系统API的微信小程序，开源发布，可免费下载部署，适合信息发布、教程资料、有声读物等内容。

## 主要功能

- 文章列表
- 文章阅读
- 文章分类和搜索
- 音频MP3播放
- 视频MP4播放
- 输入密码访问加密文章
- 文章评论、点赞、分享海报

## 使用须知

- 下载安装部署 [emlog](https://emlog.net)，并开启api（系统-设置-api-开启api）
- 微信小程序使用api必须是https，因此需要自己的博客网站配置ssl证书。
- 下载小程序安装包，解压后直接使用【[微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)】打开即可调试和发布。
- 在 miniprogram 目录app.js配置api密钥、api地址、小程序名称、介绍等信息

## 备案和认证

- 需要完成认证，认证后的小程序才可以正式发布，否则只能自己体验测试。
- 发布文章内容的小程序可能会被识别为【信息资讯】类目，该类目需要企业认证。
- 需要在微信小程序后台完成备案，不备案无法通过审核。

## 配置文件

配置文件：miniprogram 目录 app.js

## License

MIT
