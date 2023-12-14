module.exports = {
  devServer: {
    // host: 'mock.yuanzixx.cn',
    // port: 8080,
    // proxy: {
    //   '/api/': {
    //     target: 'http://localhost:5001',
    //     // changeOrigin: true,
    //   }
    // }
  },
  filenameHashing: true,
  publicPath: process.env.NODE_ENV === 'production' ? 'https://static.yuanzixx.cn/public/admin' : '/',
};
