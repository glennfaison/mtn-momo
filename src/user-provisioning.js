const axios = require('axios').default;
const { v4: uuid } = require('uuid');
const HttpStatus = require('http-status-codes');

const baseUrl = 'https://sandbox.momodeveloper.mtn.com';
const defaultContentType = 'application/json';

/**
 *  Sandbox User Provisioning module for MTN Mobile Money API
 */
class UserProvisioningAPI {
  constructor () {
    // Ensure there is only ever one instance of this class in the runtime
    if (UserProvisioningAPI.singleton) { return UserProvisioningAPI.singleton; }
    UserProvisioningAPI.singleton = this;
  }

  /**
   *  Create an API user in the sandbox target environment.
   *  @param {object} options
   *  @param {number} options.providerCallbackHost The provider callback host
   *  @param {string} options.subscriptionKey Subscription key which provides access to this API
   *  @returns {Promise<string>} a `referenceId`
   */
  async createApiUser ({ providerCallbackHost, subscriptionKey }) {
    const path = `${baseUrl}/v1_0/apiuser`;
    const userId = uuid();
    await axios.post(path, { providerCallbackHost }, {
      headers: {
        'X-Reference-Id': userId,
        'Content-Type': defaultContentType,
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });
    return userId;
  }

  /**
   *  Fetch API user information
   *  @param {Object} options
   *  @param {string} options.userId Format - UUID. Recource ID for the API user to be
   *  created. UUID version 4 is required
   *  @param {string} options.subscriptionKey Subscription key which provides access to this API
   *  @returns {Promise<{ providerCallbackHost: string, targetEnvironment: string }>}
   */
  async fetchApiUser ({ userId, subscriptionKey }) {
    const path = `${baseUrl}/v1_0/apiuser/${userId}`;
    const res = await axios.get(path, {
      headers: {
        'Content-Type': defaultContentType,
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });
    if (res.status === HttpStatus.OK) { return res.data; }
  }

  /**
   *  Create an API key for an API user in the sandbox target environment.
   *  @param {Object} options
   *  @param {string} options.userId Format - UUID. Recource ID for the API user to be
   *  created. UUID version 4 is required
   *  @param {string} options.subscriptionKey Subscription key which provides access to this API
   *  @memberof Sandbox
   *  @returns {Promise<string>} `apiKey`
   */
  async createApiKey ({ userId, subscriptionKey }) {
    const path = `${baseUrl}/v1_0/apiuser/${userId}/apikey`;
    const res = await axios.post(path, {}, {
      headers: {
        'Content-Type': defaultContentType,
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });
    if (res.status === HttpStatus.CREATED) { return res.data.apiKey; }
  }

  /**
   *  Generate credentials in `sandbox`/`development` mode
   *  @param {Object} options
   *  @param {string} options.subscriptionKey Subscription key which provides access to this API
   *  @param {string} options.providerCallbackHost The provider callback host
   *  @returns {Promise<{ userId: string, apiKey: string, targetEnvironment: string }>} a user with credentials
   */
  async createApiUserAndKey ({ subscriptionKey, providerCallbackHost }) {
    const userId = await this.createApiUser({ providerCallbackHost, subscriptionKey });
    const { targetEnvironment } = await this.fetchApiUser({ userId, subscriptionKey });
    const apiKey = await this.createApiKey({ userId, subscriptionKey });

    return { userId, apiKey, targetEnvironment };
  }
}

const service = new UserProvisioningAPI();
Object.freeze(service);

module.exports = service;

/** @typedef {import('./base').MtnMomoUser} MtnMomoUser */
