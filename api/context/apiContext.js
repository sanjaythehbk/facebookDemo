import { getEnvValue } from '../../utils/env.util.js';

export const createApiContext = (request) => {
  // FB_ACCESS_TOKEN comes from config/{env}_config.env or the CI environment
  const accessToken = process.env.FB_ACCESS_TOKEN || 'placeholder-token-set-FB_ACCESS_TOKEN';

  return {
    request,
    baseUrl: getEnvValue('BASE_URL_API'),
    accessToken
  };
};
