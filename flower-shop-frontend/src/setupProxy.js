const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function createProxy(app) {
  app.use(
    createProxyMiddleware('/api',{
      target: process.env.REACT_APP_LOCAL_DEV_URL,
      changeOrigin: true
    })
  );
};