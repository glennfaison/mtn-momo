# mtn-momo
Node.js wrapper for the MTN Mobile Money API

## Using the Collections API
```javascript

// Import the module
const { userProvisioning, initCollections } = require('mtn-momo');

const subscriptionKey = 'COLLECTIONS_PRIMARY_KEY';

// (sandbox/development environment only) Provision/create a user and api key
const sandboxUserInfo = await userProvisioning.createApiUserAndKey({
  subscriptionKey: subscriptionKey,
  providerCallbackHost: 'PROVIDER_CALLBACK_HOST'
});
const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

// Initialize the wrapper
const collections = initCollections({
  subscriptionKey,
  apiKey,
  userId,
  targetEnvironment
});

/* Collections API */

// (optional) Get an access token
const token = await collections.getToken();
const { token_type, access_token, expires_in } = token;

// Check if an account is active. Returns a boolean value
const isActive = await collections.isAccountActive({
  accountHolderIdType: 'msisdn',
  accountHolderId: 'PHONE_NUMBER'
});

// Submit a request for payment
const paymentOptions = {
  amount: 15000,
  currency: 'EUR',
  externalId: '123456789',
  payer: {
    partyIdType: 'msisdn',
    partyId: 'PHONE_NUMBER'
  },
  payerMessage: 'message',
  payeeNote: 'note'
};
const transactionId = await collections.initiate({
  callbackUrl: 'http://test1.com',
  paymentOptions: paymentOptions
});

// Check the status of a request for payment
const transaction = await collections.fetchTransaction(transactionId);
const {
  amount,
  currency,
  financialTransactionId,
  externalId,
  payer: {
    partyIdType,
    partyId
  },
  status: 'SUCCESSFUL|FAILED|PENDING',
  reason: {
    code,
    message
  }
} = transaction;

// Check my account balance
const accountBalance = await collections.fetchAccountBalance();
const { currency, availableBalance } = accountBalance;

/* End Collections API */

```



## Using the Disbursements API
```javascript

// Import the module
const { userProvisioning, initDisbursements } = require('mtn-momo');

const subscriptionKey = 'DISBURSEMENTS_PRIMARY_KEY';

// (sandbox/development environment only) Provision/create a user and api key
const sandboxUserInfo = await userProvisioning.createApiUserAndKey({
  subscriptionKey: subscriptionKey,
  providerCallbackHost: 'PROVIDER_CALLBACK_HOST'
});
const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

// Initialize the wrapper
const disbursements = initDisbursements({
  subscriptionKey,
  apiKey,
  userId,
  targetEnvironment
});

/* Disbursements API */

// (optional) Get an access token
const token = await disbursements.getToken();
const { token_type, access_token, expires_in } = token;

// Check if an account is active. Returns a boolean value
const isActive = await disbursements.isAccountActive({
  accountHolderIdType: 'msisdn',
  accountHolderId: 'PHONE_NUMBER'
});

// Submit a request for payment
const paymentOptions = {
  amount: 15000,
  currency: 'EUR',
  externalId: '123456789',
  payee: {
    partyIdType: 'msisdn',
    partyId: 'PHONE_NUMBER'
  },
  payerMessage: 'message',
  payeeNote: 'note'
};
const transactionId = await disbursements.initiate({
  callbackUrl: 'http://test1.com',
  paymentOptions: paymentOptions
});

// Check the status of a request for payment
const transaction = await disbursements.fetchTransaction(transactionId);
const {
  amount,
  currency,
  financialTransactionId,
  externalId,
  payee: {
    partyIdType,
    partyId
  },
  status: 'SUCCESSFUL|FAILED|PENDING',
  reason: {
    code,
    message
  }
} = transaction;

// Check my account balance
const accountBalance = await disbursements.fetchAccountBalance();
const { currency, availableBalance } = accountBalance;

/* End Disbursements API */

```



## Using the Remittances API
```javascript

// Import the module
const { userProvisioning, initRemittances } = require('mtn-momo');

const subscriptionKey = 'REMITTANCES_PRIMARY_KEY';

// (sandbox/development environment only) Provision/create a user and api key
const sandboxUserInfo = await userProvisioning.createApiUserAndKey({
  subscriptionKey: subscriptionKey,
  providerCallbackHost: 'PROVIDER_CALLBACK_HOST'
});
const { userId, apiKey, targetEnvironment } = sandboxUserInfo;

// Initialize the wrapper
const remittances = initRemittances({
  subscriptionKey,
  apiKey,
  userId,
  targetEnvironment
});

/* Remittances API */

// (optional) Get an access token
const token = await remittances.getToken();
const { token_type, access_token, expires_in } = token;

// Check if an account is active. Returns a boolean value
const isActive = await remittances.isAccountActive({
  accountHolderIdType: 'msisdn',
  accountHolderId: 'PHONE_NUMBER'
});

// Submit a request for payment
const paymentOptions = {
  amount: 15000,
  currency: 'EUR',
  externalId: '123456789',
  payee: {
    partyIdType: 'msisdn',
    partyId: 'PHONE_NUMBER'
  },
  payerMessage: 'message',
  payeeNote: 'note'
};
const transactionId = await remittances.initiate({
  callbackUrl: 'http://test1.com',
  paymentOptions: paymentOptions
});

// Check the status of a request for payment
const transaction = await remittances.fetchTransaction(transactionId);
const {
  amount,
  currency,
  financialTransactionId,
  externalId,
  payee: {
    partyIdType,
    partyId
  },
  status: 'SUCCESSFUL|FAILED|PENDING',
  reason: {
    code,
    message
  }
} = transaction;

// Check my account balance
const accountBalance = await remittances.fetchAccountBalance();
const { currency, availableBalance } = accountBalance;

/* End Remittances API */

```