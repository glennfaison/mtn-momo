const { describe, it } = require('mocha');
const { expect } = require('chai');
const { config } = require('dotenv');

const { useUserProvisioning } = require('.');

config();

describe('Sandbox User Provisioning', () => {
  it('should create a sandbox user and api key', async () => {
    const sandboxUserInfo = await useUserProvisioning.createApiUserAndKey({
      subscriptionKey: process.env.DISBURSEMENTS_PRIMARY_KEY,
      providerCallbackHost: process.env.PROVIDER_CALLBACK_HOST
    });
    const { userId, targetEnvironment, apiKey } = sandboxUserInfo;

    expect(userId).to.be.a('string');
    expect(targetEnvironment).to.equal('sandbox');
    expect(apiKey).to.be.a('string');
  });
});
