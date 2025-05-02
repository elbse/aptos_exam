import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

// Set up config to connect to the testnet
const config = new AptosConfig({ network: Network.TESTNET }); // You can change to MAINNET if needed
const aptos = new Aptos(config);

async function main() {
    const PRIVATE_KEY = new Ed25519PrivateKey("ed25519-priv-0x31a7d0a37cedb54983d949dbd10e5e2c7ae391e50d2712cc9e08faa53d502184");
    const MY_ACCOUNT = Account.fromPrivateKey({ privateKey: PRIVATE_KEY });
  
    const myBalance = await aptos.getAccountAPTAmount({
        accountAddress: MY_ACCOUNT.accountAddress,
      });

      console.log("Balance:", myBalance);
      const transaction = await aptos.transaction.build.simple({
        sender: MY_ACCOUNT.accountAddress,
        data: {
          function: "0x170f93ee13ff2a1bce872beb4d099ea15a52fb7ef2f01d18d7c889e21f0be543e::tba_exam::add_participant",
          functionArguments: [
            "0024e554b7721aeeff4cb2a7c47b23983643e0cce2cea7cbb35d3fea4c18e453", // wallet
            "elbse",
            "charissepriego0140@gmail.com",
            "elbse_",
          ],
        },
      });

      const senderAuthenticator = aptos.transaction.sign({
        signer: MY_ACCOUNT,
        transaction,
      });

      const pendingTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
      });

      console.log("Pending Txn Hash:", pendingTransaction.hash);

      const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });
    
      console.log(
        `Transaction completed with status: ${txnResult.success ? "SUCCESS" : "FAILURE"}`
      );
    }

main().catch(console.error);