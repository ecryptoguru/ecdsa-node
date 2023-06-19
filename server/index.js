const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0399413458c09c92dbe1993015ff3d6d5e7dcd686c1c2a4a74808311d23d7961a2": 100,
  "031048674725e9e7b75e464363ebee8ea6f49d192c96f9c6d1f27cb14672d75751": 50,
  "0383c9070d3de8ebd9c90693924b100211a7786ae5eb282e1d330e535856f9d819": 75,

};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const message = "Transfer crypto";
  const hashedMessage = keccak256(utf8ToBytes(message));
  const { sender, recipient, amount, r, s, recovery, publicKey } = req.body;

  const bigIntR = BigInt(r);
  const bigIntS = BigInt(s);
  const sig = new secp.secp256k1.Signature(bigIntR, bigIntS, parseInt(recovery));

  const verify = secp.secp256k1.verify(sig, hashedMessage, publicKey);
  console.log(verify);

  if (verify) {

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
