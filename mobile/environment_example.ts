import Constants from 'expo-constants';

interface IEnv {
  NODE_ENV: string;
  GOOGLE_ID: string;
  API_URI: string;
  DSN_SENTRY_URI: string;
}

const ENV = {
  dev: {
    NODE_ENV: 'dev',
    GOOGLE_ID: '',
    API_URI: '',
    DSN_SENTRY_URI: '',
  },
  staging: {
    NODE_ENV: 'staging',
    GOOGLE_ID: '',
    API_URI: '',
    DSN_SENTRY_URI: '',
  },
  prod: {
    NODE_ENV: 'prod',
    GOOGLE_ID: '',
    API_URI: '',
    DSN_SENTRY_URI: '',
  },
};

// command: expo publish --release-channel prod-v1 / expo build:android --release-channel prod-v1

function getEnvVars(): IEnv {
  const env = Constants.manifest.releaseChannel;

  if (env === null || env === undefined || env === '') {
    return ENV.dev;
  }
  if (env.indexOf('dev') !== -1) {
    return ENV.dev;
  }
  if (env.indexOf('staging') !== -1) {
    return ENV.staging;
  }
  if (env.indexOf('prod') !== -1) {
    return ENV.prod;
  }

  return ENV.dev;
}

export default getEnvVars();
