const { describe, it } = require('mocha');
const { expect } = require('chai');
const { config } = require('dotenv');

const { useDisbursements, useUserProvisioning } = require('.');

config();

describe('Single run-through for Disbursements API', () => {
  it('should not throw', async () => {
    // Import package

    const subscriptionKey = process.env.DISBURSEMENTS_PRIMARY_KEY;

    // (sandbox/development environment only) Provision/create a user and api key
    const sandboxUserInfo = await useUserProvisioning.createApiUserAndKey({
      subscriptionKey: subscriptionKey,
      providerCallbackHost: process.env.PROVIDER_CALLBACK_HOST
    });
    const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

    // Initialize the wrapper
    const disbursements = useDisbursements({
      subscriptionKey,
      apiKey,
      userId,
      targetEnvironment
    });

    /* Disbursements API */

    // (optional) Get an access token
    const token = await disbursements.getToken();
    expect(token).to.have.property('expires_in');
    expect(token.expires_in).to.be.lessThan(Date.now());

    // Check if an account is active. Returns a boolean value
    const isActive = await disbursements.isAccountActive({
      accountHolderIdType: 'msisdn',
      accountHolderId: '237675611933'
    });
    expect(isActive).to.be.a('boolean');

    // Approve a request for payment
    const paymentOptions = {
      amount: 15000,
      currency: 'EUR',
      externalId: '123456789',
      payee: { // Account holder
        partyIdType: 'msisdn',
        partyId: '237675611933'
      },
      payerMessage: 'message',
      payeeNote: 'note'
    };
    const transactionId = await disbursements.initiate({
      callbackUrl: 'http://test.com',
      paymentOptions: paymentOptions
    });
    expect(transactionId).to.be.a('string');

    // Check the status of a for payment
    const transaction = await disbursements.fetchTransaction(transactionId);
    expect(transaction).to.be.an('object');

    // Check my account balance
    const accountBalance = await disbursements.fetchAccountBalance();
    expect(accountBalance).to.be.an('object');

    /* End Disbursements API */
  });
});
