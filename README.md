# admin 后台

## 本地调试
- 安装 node
- 打开终端到源代码路径下 npm install 安装必要的依赖包
- npm run dev 启动本地调试

src/api/constants.ts 为服务端端口配置，可更改为本地服务端口

## 服务器部署
- 将更改的代码提交到 git 仓库
- 登录服务器，进入 /root/repo/ai-admin-web 目录
- git pull 拉取最新代码
- npm run build 编译代码
- npm run deploy:prod 部署代码
- 输入 pm2 ls 查看服务器状态
