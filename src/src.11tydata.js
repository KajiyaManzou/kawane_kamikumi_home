module.exports = {
  permalink: function (data) {
    // "src/" プレフィックスを除去して出力パスを正規化
    // 例: /src/archives/index → /archives/index.html
    return data.page.filePathStem.replace(/^\/src\//, "/") + ".html";
  },
};
