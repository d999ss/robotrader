module.exports = {
  ...require('@vercel/style-guide/prettier'),
  plugins: [
    require.resolve('prettier-plugin-packagejson'),
  ],
};
