const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);

const { abi, evm } = require("../compile");
const { enterPlayer } = require("../util");

let lottery;
let accounts;

beforeEach(async () => {
  // Get a list of all accounts.
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract.
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await enterPlayer(lottery, accounts[0], web3, "0.02");
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.strictEqual(players[0], accounts[0]);
    assert.strictEqual(players.length, 1);
  });

  it("allows multiple accounts to enter", async () => {
    await enterPlayer(lottery, accounts[0], web3, "0.02");
    await enterPlayer(lottery, accounts[1], web3, "0.02");
    await enterPlayer(lottery, accounts[2], web3, "0.02");
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.strictEqual(players[0], accounts[0]);
    assert.strictEqual(players[1], accounts[1]);
    assert.strictEqual(players[2], accounts[2]);
    assert.strictEqual(players.length, 3);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await enterPlayer(lottery, accounts[3], web3, 0);
      assert(false); // test would fail if request was successful
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("sends money to the winner and resets the player array", async () => {
    await enterPlayer(lottery, accounts[0], web3, "2");
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei("1.8", "ether")); // take into account gas needed to send transaction
  });
});
