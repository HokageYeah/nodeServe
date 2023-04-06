module.exports = {
  apps: [
    {
      name: "my-app",
      script: "src/main.ts",
      interpreter: "ts-node",
      args: "--transpile-only",
      watch: true,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      // Use tsconfig-paths
      node_args: ["-r", "tsconfig-paths/register"],
    },
  ],
};
