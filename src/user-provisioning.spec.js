const { describe, it } = require('mocha');
const { expect } = require('chai');

const momo = require('./user-provisioning');

describe('Sandbox User Provisioning', () => {
  it('should create a sandbox user and api key', async () => {
    const sandboxUserInfo = await momo.createApiUserAndKey({
      subscriptionKey: '<your-subscription-key>',
      providerCallbackHost: '<your-callback-host>'
    });
    const { userId, providerCallbackHost, targetEnvironment, apiKey } = sandboxUserInfo;

    expect(userId).to.be.a('string');
    expect(providerCallbackHost).to.be.a('string');
    expect(targetEnvironment).to.equal('sandbox');
    expect(apiKey).to.be.a('string');
  });
});
