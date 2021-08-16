import { v4 as uuidv4 } from "uuid";
import { Account, Transaction, writeToFile } from "../util";


let allAccounts: Account[];
let allTransactions: Transaction[];

try {
  allAccounts = require('../../database/accounts');
} catch (err) {
  console.log('No Account Database');
}
try {
  allTransactions = require('../../database/transactions');
} catch (err) {
  console.log('No Transaction Database');
}


export async function findAllAccounts(): Promise<Account[]> {
  return new Promise((resolve, reject) => {
    try {
      resolve(allAccounts);
    } catch (err) {
      reject(err);
    }
  });
}

export function findAccount(account: string): Promise<Account | undefined> {
  return new Promise((resolve) => {
    if (!allAccounts) {
      allAccounts = [];
    }
    const individualAccount = allAccounts.find((x) => x.account === account);
    resolve(individualAccount);
  });
}

export async function create(userInfo: Account): Promise<Account | undefined> {
  return new Promise((resolve) => {
    if (!allAccounts) {
      allAccounts = [];
    }
    const newAccount = { createdAt: new Date().toISOString(), ...userInfo };
    allAccounts.push(newAccount);
    writeToFile('./database/accounts.json', allAccounts);
    resolve(newAccount);
  });
}

export async function update(senderBalance: string, receiverBalance: string, description: string, from: string, to: string, amount: string | number):Promise<Transaction> {
  return new Promise(resolve => {
    const senderIndex = allAccounts.findIndex((x) => x.account === from);
    const receiverIndex = allAccounts.findIndex((x) => x.account === to);
    allAccounts[senderIndex].amount = senderBalance;
    allAccounts[receiverIndex].amount = receiverBalance;
    writeToFile('./database/accounts.json', allAccounts);
    const transaction: Transaction = {
      createdAt: new Date().toISOString(),
      reference: uuidv4(),
      senderAccount: from,
      amount,
      receiverAccount: to,
      transferDescription: description,
    };
    if (!allTransactions) {
      allTransactions = [];
    }
    allTransactions.push(transaction)
    writeToFile('./database/transactions.json', allTransactions)
    resolve(transaction)
  });
}

export async function findAllTransaction(): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    try {
      resolve(allTransactions);
    } catch (err) {
      reject(err);
    }
  });
}

export function findTransaction(id: string): Promise<Transaction | undefined> {
  return new Promise((resolve) => {
    if (!allTransactions) {
      allTransactions = [];
    }
    const transaction = allTransactions.find((x) => x.reference === id);
    resolve(transaction);
  });
}
