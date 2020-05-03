const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const momo = require('../src/collection');

let collections;

describe('Collection API', () => {
  before(async () => {
    // Generate a user and api key
    const sandboxUserInfo = await momo.createApiUserAndKey({
      subscriptionKey: '<your-subscription-key>',
      providerCallbackHost: '<your-callback-host>'
    });
    const { userId, apiKey } = sandboxUserInfo;

    // Initialize the wrapper
    const initializedWrapper = momo({ apiKey, userId });
    collections = initializedWrapper.collections;
  });

  describe('Creating an access token', () => {
    it('should return a valid token', async () => {
      const token = await collections.getToken();
      const { access_token, token_type, expires_in } = token;

      expect(access_token).to.be.a('string');
      expect(token_type).to.be.a('string');
      expect(expires_in).to.be.a('number');
      expect(expires_in > Date.now()).to.be.true;
    });
  });

  describe('Checking if an account is active', () => {
    it('should return true for valid phone number', async () => {
      const isActive = await collections.isAccountActive({
        accountHolderIdType: 'MSISDN|EMAIL|PARTY_CODE',
        accountHolderId: '<account-holder-id>'
      });
      expect(isActive).to.be.true;
    });

    it('should return false for invalid phone number', async () => {
      const isActive = await collections.isAccountActive({
        accountHolderIdType: 'MSISDN|EMAIL|PARTY_CODE',
        accountHolderId: '<account-holder-id>'
      });
      expect(isActive).to.be.false;
    });
  });

  describe('Requesting a payment', () => {
    it('should not throw for valid parameters', async () => {
    });

    it('should throw for invalid parameters', async () => {
    });
  });

  describe('Verifying the status of a payment', () => {
    it('should have a status of \'FAILED\' for the number ', async () => {
    });

    it('should have a status of \'REJECTED\' for the number ', async () => {
    });

    it('should have a status of \'TIMEOUT\' for the number ', async () => {
    });

    it('should have a status of \'PENDING\' for the number ', async () => {
    });

    it('should have a status of \'SUCCESS\' for the number ', async () => {
    });
  });

  describe('Fetching my account balance', () => {
    it('should not throw', async () => {});
  });
});
