import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';



function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const [r, setR] = useState()
  const [s, setS] = useState()
  const [recovery, setRecovery] = useState()
  const [publicKey, setPublicKey] = useState("");

  console.log(r, "- ", s)
  console.log(typeof r, typeof s)

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        r,
        s,
        recovery,
        publicKey,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Enter signed message
        <input
          placeholder="r"
          value={r}
          onChange={setValue(setR)}
        ></input>
        <input
          placeholder="s"
          value={s}
          onChange={setValue(setS)}
        ></input>
        <input
          placeholder="recovery"
          value={recovery}
          onChange={setValue(setRecovery)}
        ></input>
        <input
          placeholder="public key"
          value={publicKey}
          onChange={setValue(setPublicKey)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
