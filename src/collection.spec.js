const { describe, it } = require('mocha');
const { expect } = require('chai');
const { config } = require('dotenv');

const { useUserProvisioning, useCollections } = require('.');

config();

describe('Single run-through for Collection API', () => {
  it('should not throw', async () => {
    const subscriptionKey = process.env.COLLECTIONS_PRIMARY_KEY;

    // (sandbox/development environment only) Provision/create a user and api key
    const sandboxUserInfo = await useUserProvisioning.createApiUserAndKey({
      subscriptionKey: subscriptionKey,
      providerCallbackHost: process.env.PROVIDER_CALLBACK_HOST
    });
    const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

    // Initialize the wrapper
    const collections = useCollections({
      subscriptionKey,
      apiKey,
      userId,
      targetEnvironment
    });

    /* Collections API */

    // (optional) Get an access token
    const token = await collections.getToken();
    expect(token).to.have.property('expires_in');
    expect(token.expires_in).to.be.lessThan(Date.now());

    // Check if an account is active. Returns a boolean value
    const isActive = await collections.isAccountActive({
      accountHolderIdType: 'msisdn',
      accountHolderId: '237675611933'
    });
    expect(isActive).to.be.a('boolean');

    // Submit a request for payment
    const paymentOptions = {
      amount: 15000,
      currency: 'EUR',
      externalId: '123456789',
      payer: { // Account holder
        partyIdType: 'msisdn',
        partyId: '237675611933'
      },
      payerMessage: 'message',
      payeeNote: 'note'
    };
    const transactionId = await collections.initiate({
      callbackUrl: 'http://test1.com',
      paymentOptions: paymentOptions
    });
    expect(transactionId).to.be.a('string');

    // Check the status of a request for payment
    const transaction = await collections.fetchTransaction(transactionId);
    expect(transaction).to.be.an('object');

    // Check my account balance
    const accountBalance = await collections.fetchAccountBalance();
    expect(accountBalance).to.be.an('object');

    /* End Collections API */
  });
});
