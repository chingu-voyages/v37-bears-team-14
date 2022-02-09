const { createProxyMiddleware } = require("simple-http-proxy-middleware");

// This sets up the dev server proxy to redirect the request to
// the backend directly.
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
