import express from 'express';
import { createAccount, getIndividualAccount, getAllAccount, transferAmount, getAllTransactions, getIndividualTransaction, errorHandle } from '../controller/controller';
const router = express.Router();


router.get('/', (req: express.Request, res: express.Response) => {
  res.send(`
  <h1> DRE-TRANSACTION-API</h1>
  <div><em>Information:</em> use "/accounts" to view all accounts in database</div>
  <div><em>Information:</em> use "/accounts/{accountNumber}" to view specific account in database</div>
  <div><em>Information:</em> use "/transer" to view all transactions in database</div>
  <div><em>Information:</em> use "/transer/{reference}" to view specific transaction in database</div>
  <div><a href=https://documenter.getpostman.com/view/16998071/Tzz7QJcE>documentationLink</a></div>
  `);
});
router.post('/create-account', createAccount);
router.get('/accounts/:id', getIndividualAccount);
router.get('/accounts', getAllAccount);
router.post('/transfer', transferAmount);
router.get('/transfer', getAllTransactions);
router.get('/transfer/:id', getIndividualTransaction);
router.get('/*', errorHandle);
router.post('/*', errorHandle);


export = router;
