module.exports = {
  apps: [
    {
      name: "GX-backend",
      script: "src/index.js",
      env: {
        SECRET_KEY: "kien0190902",
        NODE_ENV: "production",
        PORT: 5002
      }
    }
  ]
};