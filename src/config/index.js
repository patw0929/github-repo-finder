const config = {
  development: {
    client_id: 'f23edd37b87fc3cc02de',
    redirect_uri: 'http://localhost:8080',
    gatekeeper: 'http://localhost:9999',
    api_uri: 'http://localhost:9999/api',
  },
  production: {},
}

const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default config[ENV];
