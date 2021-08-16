import { Request, Response } from 'express';
import { findAllAccounts, create, findAccount, update, findAllTransaction, findTransaction } from '../model/model';
import { Account } from '../util';


export async function getAllAccount(req: Request, res: Response): Promise<void> {
  const accounts = await findAllAccounts();
  if (accounts) {
    res.status(200).send(accounts);
  } else {
    res.status(404).send('No Accounts found in the database.');
  }
}

export async function getIndividualAccount(req: Request, res: Response): Promise<void> {
  const account = req.params.id;
  const data = await findAccount(account);
  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send(`User with ${account} doesn't exists`);
  }
}

export async function createAccount(req: Request, res: Response): Promise<Response> {
  const { account, amount } = req.body;
  if (!account || !amount) {
    return res.status(404).send(`Both amount and account must be provided`);
  }
  if (String(account).length == 10) {
    const user = await findAccount(account);
    if (user) {
      return res.status(404).send(`User with ${account} already exists`);
    }
    const accountInfo: Account = {
      account: String(account),
      amount: amount.toLocaleString()
    };
    const newAccount = await create(accountInfo);
    return res.status(201).send({ ...newAccount, status: 'Account Created Successfully' });
  } else {
    return res.status(404).send('Please ensure account is exactly 10 digits');
  }
}

export async function transferAmount(req: Request, res: Response): Promise<Response | undefined> {
  const { from, to, amount, description } = req.body;


  if (!from || !to || !amount || !description) {
    return res.status(404).send('All fields (from, to, amount, description) are compulsory');
  }
  if (String(from) === String(to)) {
    return res.status(404).send(`Sender's account ${from} and receiver's account ${to} are equal`);
  }
  const fro = String(from);
  const sen = String(to);
  const sender = await findAccount(fro);
  const receiver = await findAccount(sen);
  if (!sender) {
    return res.status(404).send(`User with ${from} doesn't exist on database`);
  }
  if (!receiver) {
    return res.status(404).send(`User with ${to} doesn't exist on database`);
  }
  const senderBalance = Number(sender.amount.replace(',', '')) - Number(String(amount).replace(',', ''));
  if (senderBalance < 0) {
    return res.status(404).send(`User with ${from} doesn't have up to ${amount} in account`);
  }
  const receiverBalance = Number(receiver.amount.replace(',', '')) + Number(String(amount).replace(',', ''));

  const data = await update(senderBalance.toLocaleString(), receiverBalance.toLocaleString(), description, fro, sen, amount);
  return res.status(201).send(data);
}

export async function getAllTransactions(req: Request, res: Response): Promise<void> {
  const transaction = await findAllTransaction();
  if (transaction) {
    res.status(200).send(transaction);
  } else {
    res.status(404).send('No transaction found in the database.');
  }
}

export async function getIndividualTransaction(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  const data = await findTransaction(id);
  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send(`Transaction with ${id} doesn't exists`);
  }
}

export function errorHandle(req: Request, res: Response): void {
  res.status(404).send('Invalid Url');
}
