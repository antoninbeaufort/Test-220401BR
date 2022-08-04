require('dotenv').config()
require('./server/server');
const { $fetch } = require('ohmyfetch');

const baseURL = 'http://localhost:3000';

const headers = {
  'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'),
};
(async () => {
  try {
    const { refresh_token } = await $fetch('/login', {
      baseURL,
      body: {
        user: process.env.LOGIN,
        password: process.env.PASSWORD,
      },
      headers,
      method: 'POST',
    });
  
    const { access_token } = await $fetch('/token', {
      baseURL,
      body: {
        grant_type: 'refresh_token',
        refresh_token,
      },
      method: 'POST',
    });
  
    const accounts = await getAccounts(access_token);
  
    const accountsWithTransactions = await getTransactionsForAccounts(access_token, accounts);
    console.log(accountsWithTransactions);
  } catch (error) {
    console.error(error);
  }
})();

const getAccounts = async (accessToken) => {
  const accounts = [];
  let accountsResult = await getPage(accessToken, '/accounts?page=1', 'account');
  accounts.push(...accountsResult.account);
  while (accountsResult.link.next) {
    accountsResult = await getPage(accessToken, accountsResult.link.next, 'account');
    accounts.push(...accountsResult.account);
  }

  // remove duplicated entries
  return accounts.filter((value, index, self) => self.findIndex(t => t.acc_number === value.acc_number) === index);
};

const getTransactionsForAccounts = async (accessToken, accounts) => {
  const accountsWithTransactions = [];
  for (const account of accounts) {
    const transactions = await getTransactionsForAccount(accessToken, account.acc_number);
    accountsWithTransactions.push({
      ...account,
      transactions,
    });
  }
  return accountsWithTransactions;
};

const getTransactionsForAccount = async (accessToken, accountNumber) => {
  const transactions = [];
  let transactionsResult = await getPage(accessToken, `/accounts/${accountNumber}/transactions`, 'transactions');
  transactions.push(...transactionsResult.transactions);
  while (transactionsResult.link.next) {
    transactionsResult = await getPage(accessToken, transactionsResult.link.next, 'transactions');
    transactions.push(...transactionsResult.transactions);
  }

  // remove duplicated entries
  return transactions.filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);
};

const getPage = async (accessToken, page, type) => {
  try {
    return await $fetch(page, {
      baseURL,
      headers: {
        Authorization: 'Bearer ' + accessToken,
      }
    });
  } catch (error) {
    console.error(error);
    return {
      [type]: [],
      link: {},
    };
  }
};