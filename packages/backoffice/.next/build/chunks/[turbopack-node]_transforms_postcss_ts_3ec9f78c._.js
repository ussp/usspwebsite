module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/packages/backoffice/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/f50ad_d0627ca8._.js",
  "chunks/[root-of-the-server]__41d24c22._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/packages/backoffice/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];