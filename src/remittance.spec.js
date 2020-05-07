const { describe, it } = require('mocha');
const { expect } = require('chai');
const { config } = require('dotenv');

const { useRemittances, useUserProvisioning } = require('.');

config();

describe('Single run-through for Remittances API', () => {
  it('should not throw', async () => {
    // Import package

    const subscriptionKey = process.env.REMITTANCES_PRIMARY_KEY;

    // (sandbox/development environment only) Provision/create a user and api key
    const sandboxUserInfo = await useUserProvisioning.createApiUserAndKey({
      subscriptionKey: subscriptionKey,
      providerCallbackHost: process.env.PROVIDER_CALLBACK_HOST
    });
    const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

    // Initialize the wrapper
    const remittances = useRemittances({
      subscriptionKey,
      apiKey,
      userId,
      targetEnvironment
    });

    /* Remittances API */

    // (optional) Get an access token
    const token = await remittances.getToken();
    expect(token).to.have.property('expires_in');
    expect(token.expires_in).to.be.lessThan(Date.now());

    // Check if an account is active. Returns a boolean value
    const isActive = await remittances.isAccountActive({
      accountHolderIdType: 'msisdn',
      accountHolderId: '237675611933'
    });
    expect(isActive).to.be.a('boolean');

    // Approve a remittance/cashout
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
    const transactionId = await remittances.initiate({
      callbackUrl: 'http://test.com',
      paymentOptions: paymentOptions
    });
    expect(transactionId).to.be.a('string');

    // Check the status of a for payment
    const transaction = await remittances.fetchTransaction(transactionId);
    expect(transaction).to.be.an('object');

    // Check my account balance
    const accountBalance = await remittances.fetchAccountBalance();
    expect(accountBalance).to.be.an('object');

    /* End Remittances API */
  });
});
