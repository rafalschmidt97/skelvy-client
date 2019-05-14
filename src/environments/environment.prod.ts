import * as npm from '../../package.json';

export const environment = {
  production: true,
  version: npm.version,
  apiUrl: 'https://api.skelvy.com/',
  versionApiUrl: 'https://api.skelvy.com/v1.0/',
};
