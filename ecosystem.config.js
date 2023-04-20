module.exports = {
  apps : [{
    name   : "app1",
    script : "ts-node --require tsconfig-paths/register src/main.ts",
    // 环境变量
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: 'development'
    },
    // 要启动的应用实例数量
    instances: 2,
    // 启动应用程序的模式，可以是cluster或fork，默认fork
    exec_mode: "fork",
    // 启动监视和重启功能
    watch: true,
    env: {
      "PORT": 8080
    }
  }]
}
