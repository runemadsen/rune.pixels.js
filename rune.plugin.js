module.exports = function(webpackConfig) {
  webpackConfig.externals.fs = 'fs';
  return webpackConfig;
}
