import PlansDB from 'gamechangers-plans-db';
import config from '../../config';

/* globals AWS */


module.exports = () => {

  // after the user is signed with an Identity Pool auth'd signin

  const {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    sessionToken
  } = AWS.config.credentials;

  const {
    REGION: region,
    PLANS_ENDPOINT: invokeUrl
  } = config;

  const cfg = {
    accessKey,
    secretKey,
    sessionToken,
    region,
    invokeUrl
  };

  return new PlansDB(cfg);
};