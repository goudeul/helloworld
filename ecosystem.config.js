/**
 * pm2 cluster 서버 config
 */
module.exports = [{
  name: 'coarsoft/naval api',
  script: './src/server-register.js',
  exec_mode: 'cluster',
  instances: 0,
  env_production: {
    NODE_ENV: 'production',
  },
  env_development: {
    NODE_ENV: 'development',
  },
}]
