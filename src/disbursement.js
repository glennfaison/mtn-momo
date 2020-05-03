const BaseAPI = require('./base');

/**
 *  MTN Mobile Money API Disbursement module
 *  @class `Disbursement`
 *  @extends {BaseAPI}
 */
class Disbursement extends BaseAPI {
  constructor ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
    super({ userId, apiKey, subscriptionKey, targetEnvironment });
    super.subApi = 'disbursement';
    Disbursement.singleton = this;
  }
}

module.exports = Disbursement;
