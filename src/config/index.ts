const hostname = window.location.hostname;

const configEnv = {
  local: {
    api: `http://${hostname}:5000/api/`,
    ws: `http://${hostname}:5000/chat`,
  },
  dev: {
    api: 'https://api.dev.liscena.com/api/',
    ws: 'https://api.dev.liscena.com/chat',
  },
  production: {
    api: 'https://api.liscena.com/api/',
    ws: 'https://api.liscena.com/chat',
  },
};

let config = configEnv.local;

const env = process.env.NODE_ENV;
if (env === 'production') {
  config = configEnv.production;
} else if (env === 'dev') {
  config = configEnv.dev;
}

export default config;
