const { createProxyMiddleware } = require("simple-http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:8080",
    })
  );

  app.use(
    "/logout",
    createProxyMiddleware({
      target: "http://localhost:8080",
    })
  );
};
