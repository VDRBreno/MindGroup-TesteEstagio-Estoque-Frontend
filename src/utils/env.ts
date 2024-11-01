import getEnvOrDefault from './getEnvOrDefault';

const env = {
  MODE: getEnvOrDefault('MODE', 'production')
}

export default env;