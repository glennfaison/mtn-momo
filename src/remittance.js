const BaseAPI = require('./base');

/**
 *  MTN Mobile Money API Remittance module
 *  @class `Remittance`
 *  @extends {BaseAPI}
 */
class Remittance extends BaseAPI {
  constructor ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
    super({ userId, apiKey, subscriptionKey, targetEnvironment });
    super.subApi = 'remittance';
    Remittance.singleton = this;
  }
}

module.exports = Remittance;
