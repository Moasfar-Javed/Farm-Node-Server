module.exports = {
  apps: [
    {
      name: "index",
      script: "./src/index.mjs",
      env: {
        TZ: "UTC",
      },
    },
  ],
};
