const axios = require('axios').default;
const HttpStatus = require('http-status-codes');
const { v4: uuid } = require('uuid');

/**
 *  Class containing the methods common to all MTN Mobile Money
 *  transaction types
 *  @abstract
 */
class BaseAPI {
  constructor ({ userId, apiKey, subscriptionKey, targetEnvironment }) {
    /** @type {string} */ this.defaultContentType = 'application/json';
    /** @type {string} */ this.baseUrl = 'https://sandbox.momodeveloper.mtn.com';
    /** @type {SubAPI} */ this.subApi = null; // This will be filled in sub-classes

    /** @type {string} */ this.userId = userId;
    /** @type {string} */ this.apiKey = apiKey;
    /** @type {string} */ this.subscriptionKey = subscriptionKey;
    /** @type {string} */ this.targetEnvironment = targetEnvironment;
    /** @type {string} */ this.authorization = Buffer
      .from(`${userId}:${apiKey}`)
      .toString('base64');
    /** @type {string} */ this.accessToken = null;
    /** @type {MtnMomoUser} */ this.apiUser = null;

    this.headers = () => ({
      'Content-Type': this.defaultContentType,
      'X-Target-Environment': this.targetEnvironment,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      Authorization: `Basic ${this.authorization}`
    });
  }

  /**
   *  Create an access token which can then be used to authorize and authenticate
   *  towards the other end-points of the API.
   *  @returns {Promise<AccessToken>}
   */
  async getToken () {
    const path = `${this.baseUrl}/${this.subApi}/token`;
    this.authorization = Buffer
      .from(`${this.userId}:${this.apiKey}`)
      .toString('base64');
    try {
      const res = await axios.post(path, {}, {
        headers: { ...this.headers() }
      });
      if (res.status === HttpStatus.CREATED) {
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *  Check if an account holder is registered and active in the system.
   *  @param {Object} options
   *  @param {string} options.accountHolderId The party number. Validated according to the party ID
   *  type (case Sensitive).
   *    - `msisdn` - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *    - `email` - Validated to be a valid e-mail format. Validated with IsEmail
   *    - `party_code` - UUID of the party. Validated with IsUuid
   *  @param {AccountHolderIdType} options.accountHolderIdType Specifies the type of the party ID. Allowed
   *  values [`msisdn`, `email`, `party_code`]. `accountHolderId` should explicitly be in small letters.
   *  @returns {Promise<boolean>}
   */
  async isAccountActive ({ accountHolderIdType, accountHolderId }) {
    const path = `${this.baseUrl}/${this.subApi}/v1_0/accountholder/${accountHolderIdType}/${accountHolderId}/active`;
    const res = await axios.get(path, {
      headers: { ...this.headers() }
    });
    if (res.status === HttpStatus.OK) { return res.data.data; }
  }

  /**
   *  Request a payment from a consumer (Payer). The payer will be asked to authorize the payment.
   *  The transaction will be executed once the payer has authorized the payment.
   *  The requesttopay will be in status `PENDING` until the transaction is authorized or declined
   *  by the payer or it is timed out by the system.
   *  @param {Object} options
   *  @param {string} options.callbackUrl
   *  @param {Transaction} options.paymentOptions
   *  @memberof Collection
   *  @returns {Promise<string>} the `transactionId`
   */
  async initiate ({ callbackUrl, paymentOptions }) {
    const transactionUrl = {
      collection: `${this.baseUrl}/${this.subApi}/v1_0/requesttopay`,
      disbursement: `${this.baseUrl}/${this.subApi}/v1_0/transfer`,
      remittance: `${this.baseUrl}/${this.subApi}/v1_0/transfer`
    };
    const path = transactionUrl[this.subApi];
    const transactionId = uuid();
    await axios.post(path, paymentOptions, {
      headers: {
        ...this.headers(),
        'X-Callback-Url': callbackUrl,
        'X-Reference-Id': transactionId
      }
    });
    return transactionId;
  }

  /**
   *  Get the balance of my account.
   *  @returns {Promise<AccountBalance>}
   */
  async fetchAccountBalance () {
    const path = `${this.baseUrl}/${this.subApi}/v1_0/account/balance`;
    const res = await axios.get(path, {
      headers: { ...this.headers() }
    });
    if (res.status === HttpStatus.OK) { return res.data; }
  }

  /**
   *  Fetch the status of a transaction by reference id.
   *  @param {string} referenceId UUID of transaction whose details are to be fetched.
   *  @returns {Promise<Transaction>}
   */
  async fetchTransaction (referenceId) {
    const transactionUrl = {
      collection: `${this.baseUrl}/${this.subApi}/v1_0/requesttopay/${referenceId}`,
      disbursement: `${this.baseUrl}/${this.subApi}/v1_0/transfer/${referenceId}`,
      remittance: `${this.baseUrl}/${this.subApi}/v1_0/transfer/${referenceId}`
    };
    const path = transactionUrl[this.subApi];
    const res = await axios.get(path, {
      headers: { ...this.headers() }
    });
    if (res.status === HttpStatus.OK) { return res.data; }
  }
}

// #region JS Docs Type Definitions

/**
 *  @typedef Collection
 *    @property {(baseUrl:string, ocpApimSubscriptionKey:string) => void} initialize
 *    @property {(options: {providerCallbackHost:string}) => Promise<void>} createApiUser
 *    @property {(xReferenceId: string) => Promise<any>} fetchApiUser
 *    @property {(xReferenceId: string) => Promise<any>} createApiKey
 */

/**
 *  @typedef AccessToken
 *    @property {string} access_token
 *    @property {string} token_type
 *    @property {number} expires_in
 */

/**
 *  @typedef Transaction
 *    @property {string} amount
 *    @property {string} currency
 *    @property {string} [financialTransactionId]
 *    @property {string} externalId
 *    @property {Object} [payee]
 *    @property {string} payee.partyIdType
 *    @property {string} payee.partyId
 *    @property {Object} [payer]
 *    @property {string} payer.partyIdType
 *    @property {string} payer.partyId
 *    @property {string} payerMessage
 *    @property {string} payeeNote
 *    @property {string} [financialTransactionId]
 *    @property {PaymentStatus} [status]
 *    @property {Object} [reason]
 *    @property {string} reason.code
 *    @property {string} reason.message
 */

/**
 *  @typedef AccountBalance
 *    @property {number} availableBalance
 *    @property {string} [currency=EUR]
 */

/**
 *  @typedef MtnMomoUser
 *    @property {string} callbackHost
 *    @property {string} subscriptionKey
 *    @property {string} referenceId
 *    @property {string} apiKey
 *    @property {TargetEnvironment} [targetEnvironment='sandbox']
 */

/** @typedef {'sandbox'|'production'} TargetEnvironment */

/** @typedef {'msisdn'|'email'|'party_code'} AccountHolderIdType */

/** @typedef {'collection'|'disbursement'|'remittance'} SubAPI */

/** @typedef {'collection'|'disbursement'|'remittance'} TransactionType */

/** @typedef {'PENDING'|'SUCCESSFUL'|'FAILED'|'TIMEOUT'|'REJECTED'} PaymentStatus */

// #endregion JS Docs Type Definitions

module.exports = BaseAPI;
