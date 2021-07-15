/**
 * pm2 실행을 위한 설정파일
 */
module.exports = [{
  name: 'coarsoft/naval api',
  script: 'babel-node ./src/app.js',
  interpreter_args: '--interpreter',
  watch: true,
  exec_mode: 'cluster',
  instances: 2,
  env_production: {
    NODE_ENV: 'production',
  },
  env_development: {
    NODE_ENV: 'development',
  },
}]
