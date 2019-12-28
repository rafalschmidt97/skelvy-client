import * as npm from '../../package.json';

export const environment = {
  production: true,
  version: npm.version,
  hostname: npm.config.hostname,
  apiUrl: 'https://api.skelvy.com/',
  versionApiUrl: 'https://api.skelvy.com/v2.0/',
};
