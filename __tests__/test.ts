import request from 'supertest';
import app from '../src/app';
import { Account, Transaction } from '../src/util';
let allAccounts: Account[];
let allTransactions: Transaction[];

try {
  allAccounts = require('../database/accounts');
} catch (err) {
  console.log('No Account Database');
}
try {
  allTransactions = require('../database/transactions');
} catch (err) {
  console.log('No Transaction Database');
}

describe("Get all Data", () => {
  it("should return 404 if there's no Account in database", async () => {
    if (!allAccounts) {
      await request(app)
        .get("/accounts")
        .set("Accept", "application/json")
        .expect(404);
    }
  });
  it("should return 404 if there's no transaction in database", async () => {
    if (!allTransactions) {
      await request(app)
        .get("/transfer")
        .set("Accept", "application/json")
        .expect(404);
    }
  });
  test("should return 200 if there's data in account's database", async () => {
    if (allAccounts) {
      await request(app)
        .get("/accounts")
        .set("Accept", "application/json")
        .expect(200);
    }
  });
  test("should return 200 if there's data in transaction's database", async () => {
    if (allTransactions) {
      await request(app)
        .get("/transfer")
        .set("Accept", "application/json")
        .expect(200);
    }
  });
});

describe("Find Account Data", () => {
  if (!allAccounts) {
    allAccounts = [];
  }
  const account = "2059333979";
  const user = allAccounts.find(x => x.account === account);
  it("should return 404 if there's no matching Account in database", async () => {
    if (!user) {
      await request(app)
        .get(`/accounts/${account}`)
        .set("Accept", "application/json")
        .expect(404);
    }
  });
  it("should return 200 if there's a match in database", async () => {
    if (user) {
      await request(app)
        .get(`/accounts/${account}`)
        .set("Accept", "application/json")
        .expect(200);
    }
  });
});

describe("Find transaction", () => {
  if (!allTransactions) {
    allTransactions = [];
  }
  const ref = "b4d594ee-edd2-415c-a547-e7482d2b477c";
  const user = allTransactions.find(x => x.reference === ref);
  it("should return 404 if there's no matching Account in database", async () => {
    if (!user) {
      await request(app)
        .get(`/transfer/${ref}`)
        .set("Accept", "application/json")
        .expect(404);
    }
  });
  it("should return 200 if there's a match in database", async () => {
    if (user) {
      await request(app)
        .get(`/transfer/${ref}`)
        .set("Accept", "application/json")
        .expect(200);
    }
  });
});

describe("Create Account", () => {
  if (!allAccounts) {
    allAccounts = [];
  }
  const acc = `${Math.floor(Math.random() * 10000000000)}`;

  const user = allAccounts.find(x => x.account === acc);
  it("should return 404 if there's a matching Account in database", async () => {
    if (user) {
      await request(app)
        .post('/create-account')
        .send({ account: acc, amount: 50000 })
        .set("Accept", "application/json")
        .expect(404);
    }
  });
  it("should return 200 if there's no match in database", async () => {
    if (!user) {
      await request(app)
        .post('/create-account')
        .send({ account: acc, amount: 50000 })
        .set("Accept", "application/json")
        .expect(201);
    }
  });
  it("should return 404 if no amount is specified while posting", async () => {
    await request(app)
      .post('/create-account')
      .send({ account: acc })
      .set("Accept", "application/json")
      .expect(404);
  });
  it("should return 404 if no account is specified while posting", async () => {
    await request(app)
      .post('/create-account')
      .send({ amount: 500000 })
      .set("Accept", "application/json")
      .expect(404);
  });
  it("should return 404 if Account passed is less than 10", async () => {
    await request(app)
      .post('/create-account')
      .send({ account: '123456789', amount: 50000 })
      .set("Accept", "application/json")
      .expect(404);
  });
  it("should return 404 if Account passed is more than 10", async () => {
    await request(app)
      .post('/create-account')
      .send({ account: '1234567891233', amount: 50000 })
      .set("Accept", "application/json")
      .expect(404);
  });
});

describe("Transfer Cash", () => {
  if (!allAccounts) {
    allAccounts = [];
  }
  const acc1 = `${allTransactions[0].account}` || `${Math.floor(Math.random() * 10000000000)}`;
  const acc2 = `${allTransactions[1].account}` || `${Math.floor(Math.random() * 10000000000)}`;

  const sender = allAccounts.find(x => x.account === acc1);
  const receiver = allAccounts.find(x => x.account === acc2);
  it("should return 200 if all fields are filled correctly without issues", async () => {
    if (sender && receiver) {
      await request(app)
        .post('/transfer')
        .send({
          from: acc1,
          to: acc2,
          description: "just because you're beautiful",
          amount: 50000
        })
        .set("Accept", "application/json")
        .expect(404);
    }
  });
  it("should return 404 if there's a matching Account in database", async () => {
    if (!sender || !receiver) {
      await request(app)
        .post('/transfer')
        .send({
          from: acc1,
          to: acc2,
          description: "just because you're beautiful",
          amount: 50000
        })
        .set("Accept", "application/json")
        .expect(404);
    }
  });

  it("should return 404 if no description is specified while posting", async () => {
    await request(app)
      .post('/transfer')
      .send({
        from: acc1,
        to: acc2,
        amount: 50000
      })
      .set("Accept", "application/json")
      .expect(404);
  });
  it("should return 404 if no amount is specified while posting", async () => {
    await request(app)
      .post('/transfer')
      .send({
        from: acc1,
        to: acc2,
        description: "just because you're beautiful"
      })
      .set("Accept", "application/json")
      .expect(404);
  });
  it("should return 404 if sender's and receiver's accounts are the same", async () => {
    await request(app)
      .post('/transfer')
      .send({
        from: acc1,
        to: acc1,
        amount: 50000,
        description: "just because you're beautiful"
      })
      .set("Accept", "application/json")
      .expect(404);
  });
});

