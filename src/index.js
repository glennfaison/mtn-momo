const userProvisioning = require('./user-provisioning');
const BaseAPI = require('./base');

// #region API credentials

/**
 *  Initialize the MoMo Collections API wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {BaseAPI}
 */
function initCollections ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  return new BaseAPI({ userId, apiKey, subscriptionKey, targetEnvironment, subApi: 'collection' });
}

/**
 *  Initialize the MoMo Disbursements API wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {BaseAPI}
 */
function initDisbursements ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  return new BaseAPI({ userId, apiKey, subscriptionKey, targetEnvironment, subApi: 'disbursement' });
}

/**
 *  Initialize the MoMo Remittances API wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {BaseAPI}
 */
function initRemittances ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  return new BaseAPI({ userId, apiKey, subscriptionKey, targetEnvironment, subApi: 'remittance' });
}

// #endregion API credentials

module.exports = {
  initCollections,
  initDisbursements,
  initRemittances,
  userProvisioning
};

/** @typedef {import('./base').MtnMomoUser} MtnMomoUser */
/** @typedef {import('./base')} BaseAPI */
