const useUserProvisioning = require('./user-provisioning');
const BaseAPI = require('./base');

/**
 *  Initialize the MoMo Collections API wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {BaseAPI}
 */
function useCollections ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  return new BaseAPI({ userId, apiKey, subscriptionKey, targetEnvironment, subApi: 'collection' });
}

/**
 *  Initialize the MoMo Disbursements API wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {BaseAPI}
 */
function useDisbursements ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  return new BaseAPI({ userId, apiKey, subscriptionKey, targetEnvironment, subApi: 'disbursement' });
}

/**
 *  Initialize the MoMo Remittances API wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {BaseAPI}
 */
function useRemittances ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  return new BaseAPI({ userId, apiKey, subscriptionKey, targetEnvironment, subApi: 'remittance' });
}

module.exports = {
  useCollections,
  useDisbursements,
  useRemittances,
  useUserProvisioning
};

/** @typedef {import('./base').MtnMomoUser} MtnMomoUser */
/** @typedef {import('./base')} BaseAPI */
