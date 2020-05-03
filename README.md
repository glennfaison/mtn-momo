# mtn-momo
Node.js wrapper for the MTN Mobile Money API

## Usage
```javascript

// Import package
const momo = require('mtn-momo');

// (sandbox/development environment only) Provision/create a user and api key
const sandboxUserInfo = await momo.createApiUserAndKey({
  subscriptionKey: '<your-subscription-key>',
  providerCallbackHost: '<your-callback-host>'
});
const { userId, apiKey, providerCallbackHost, targetEnvironment } = sandboxUserInfo;

// Initialize the wrapper
const initializedWrapper = momo({
  subscriptionKey: '<your-subscription-key>',
  apiKey: '<your-api-key>',
  userId: '<your-user-id>',
  targetEnvironment: '<target-environment>'
});
const { collections, disbursements, remittances } = initializedWrapper;



/* Collections API */

// (optional) Get an access token
const token = await collections.getToken();
const { access_token, token_type, expires_in } = token;

// Check if an account is active. Returns a boolean value
const isActive = await collections.isAccountActive({
  accountHolderIdType: 'MSISDN|EMAIL|PARTY_CODE',
  accountHolderId: '<account-holder-id>'
});

// Submit a request for payment
const paymentOptions = {
  amount: "string", // A number as a string
  currency: "string",
  externalId: "string",
  payer: { // Account holder
    partyIdType: "MSISDN|EMAIL|PARTY_CODE",
    partyId: "string"
  },
  payerMessage: "string",
  payeeNote: "string"
};
const transactionId = await collections.initiate({
  callbackUrl: '<callback-url>',
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
  status: "SUCCESSFUL|FAILED|PENDING",
  reason: {
    code,
    message
  }
} = transaction;

// Check my account balance
const accountBalance = await collections.fetchAccountBalance();
const { availableBalance, currency } = accountBalance;

/* End Collections API */



/* Disbursements API */

// (optional) Get an access token
const token = await disbursements.getToken();
const { access_token, token_type, expires_in } = token;

// Check if an account is active. Returns a boolean value
const isActive = await disbursements.isAccountActive({
  accountHolderIdType: 'MSISDN|EMAIL|PARTY_CODE',
  accountHolderId: '<account-holder-id>'
});

// Approve a request for payment
const paymentOptions = {
  amount: "string", // A number as a string
  currency: "string",
  externalId: "string",
  payee: {
    partyIdType: "MSISDN|EMAIL|PARTY_CODE",
    partyId: "string"
  },
  payerMessage: "string",
  payeeNote: "string"
};
const transactionId = await disbursements.initiate({
  callbackUrl: '<callback-url>',
  paymentOptions: paymentOptions
});

// Check the status of a payment
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
  status: "SUCCESSFUL|FAILED|PENDING",
  reason: {
    code,
    message
  }
} = transaction;

// Check my account balance
const accountBalance = await disbursements.fetchAccountBalance();
const { availableBalance, currency } = accountBalance;

/* End Remittances API */



/* Remittances API */

// (optional) Get an access token
const token = await remittances.getToken();
const { access_token, token_type, expires_in } = token;

// Check if an account is active. Returns a boolean value
const isActive = await remittances.isAccountActive({
  accountHolderIdType: 'MSISDN|EMAIL|PARTY_CODE',
  accountHolderId: '<account-holder-id>'
});

// Approve a request for payment
const paymentOptions = {
  amount: "string", // A number as a string
  currency: "string",
  externalId: "string",
  payee: {
    partyIdType: "MSISDN|EMAIL|PARTY_CODE",
    partyId: "string"
  },
  payerMessage: "string",
  payeeNote: "string"
};
const transactionId = await remittances.initiate({
  callbackUrl: '<callback-url>',
  paymentOptions: paymentOptions
});

// Check the status of a payment
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
  status: "SUCCESSFUL|FAILED|PENDING",
  reason: {
    code,
    message
  }
} = transaction;

// Check my account balance
const accountBalance = await remittances.fetchAccountBalance();
const { availableBalance, currency } = accountBalance;

/* End Remittances API */

```
