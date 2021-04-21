const spawn = require("cross-spawn");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "json",
      generateStatsFile: true,
      statsFilename: "stats.json",
      statsOptions: {
        context: "./src",
        assets: true,
        entrypoints: true,
        chunks: true,
        modules: true,
        builtAt: true,
        hash: true,
      },
    }),
  ],
};
