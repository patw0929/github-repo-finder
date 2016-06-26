const config = {
  development: {
    client_id: 'f23edd37b87fc3cc02de',
    redirect_uri: 'http://localhost:8080',
    gatekeeper: 'http://localhost:9999',
    api_uri: 'http://localhost:9999/api',
  },
  production: {
    client_id: '54934ebbee82755104cd',
    redirect_uri: 'http://github-repo-finder.patw.me',
    gatekeeper: 'https://github-repo-finder.herokuapp.com',
    api_uri: 'https://github-repo-finder.herokuapp.com/api'
  },
}

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default config[ENV];
