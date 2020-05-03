const BaseAPI = require('./base');

/**
 *  MTN Mobile Money API Collection module
 *  @class `Collection`
 *  @extends {BaseAPI}
 */
class Collection extends BaseAPI {
  constructor ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
    super({ userId, apiKey, subscriptionKey, targetEnvironment });
    super.subApi = 'collection';
    Collection.singleton = this;
  }
}

module.exports = Collection;
