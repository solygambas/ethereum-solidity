// https://docs.soliditylang.org/en/v0.8.5/using-the-compiler.html#compiler-input-and-output-json-description

const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": { content: source },
  },
  settings: {
    metadata: {
      useLiteralContent: true,
    },
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts["Lottery.sol"].Lottery;
