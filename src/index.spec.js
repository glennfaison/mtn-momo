const { describe, it } = require('mocha');
const { expect } = require('chai');
const { config } = require('dotenv');

config();

describe.only('Single run-through', () => {
  it('should not throw', async () => {
    // Import package
    const momo = require('.');

    const subscriptionKey = process.env.SUBSCRIPTION_KEY;

    // (sandbox/development environment only) Provision/create a user and api key
    const sandboxUserInfo = await momo.createApiUserAndKey({
      subscriptionKey: subscriptionKey,
      providerCallbackHost: process.env.PROVIDER_CALLBACK_HOST
    });
    const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

    // Initialize the wrapper
    const initializedWrapper = momo({
      subscriptionKey,
      apiKey,
      userId,
      targetEnvironment
    });
    const { collections } = initializedWrapper;

    /* Collections API */

    // (optional) Get an access token
    const token = await collections.getToken();
    expect(token).to.have.property('expires_in');
    expect(token.expires_in).to.be.lessThan(Date.now());

    // Check if an account is active. Returns a boolean value
    const isActive = await collections.isAccountActive({
      accountHolderIdType: 'MSISDN',
      accountHolderId: '237675611933'
    });
    expect(isActive).to.be.a('boolean');

    // Submit a request for payment
    const paymentOptions = {
      amount: 15000,
      currency: 'EUR',
      externalId: '0123456789',
      payer: { // Account holder
        partyIdType: 'MSISDN',
        partyId: '237675611933'
      },
      payerMessage: 'message',
      payeeNote: 'note'
    };
    const transactionId = await collections.initiate({
      callbackUrl: 'http://test.com',
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
