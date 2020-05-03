const userProvisioning = require('./user-provisioning');
const Collection = require('./collection');
const Disbursement = require('./disbursement');
const Remittance = require('./remittance');

// #region API credentials

/**
 *  Create fake credentials in `sandbox`/`development` mode
 *  @param {Object} options
 *  @param {string} options.subscriptionKey Subscription key which provides access to this API
 *  @param {string} options.providerCallbackHost The provider callback host
 *  @returns {Promise<{ userId: string, apiKey: string, targetEnvironment: string }>} a user with credentials
 */
async function createApiUserAndKey ({ subscriptionKey, providerCallbackHost }) {
  const userId = await userProvisioning.createApiUser({ providerCallbackHost, subscriptionKey });
  const { targetEnvironment } = await userProvisioning.fetchApiUser({ userId, subscriptionKey });
  const apiKey = await userProvisioning.createApiKey({ userId, subscriptionKey });

  return { userId, apiKey, targetEnvironment };
}

/**
 *  Initialize the MoMo wrapper
 *  @param {Object} options
 *  @param {string} options.userId the user id
 *  @param {string} options.apiKey the api key
 *  @returns {{ collections: Collection, disbursements: Disbursement, remittances: Remittance }}
 */
function momo ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
  const collections = new Collection({ userId, apiKey, subscriptionKey, targetEnvironment });
  const disbursements = new Disbursement({ userId, apiKey, subscriptionKey, targetEnvironment });
  const remittances = new Remittance({ userId, apiKey, subscriptionKey, targetEnvironment });
  return { collections, disbursements, remittances };
}

// #endregion API credentials

momo.createApiUserAndKey = createApiUserAndKey;

module.exports = momo;

/** @typedef {import('./base').MtnMomoUser} MtnMomoUser */
/** @typedef {import('./collection')} Collection */
/** @typedef {import('./disbursement')} Disbursement */
/** @typedef {import('./Remittance')} Remittance */
