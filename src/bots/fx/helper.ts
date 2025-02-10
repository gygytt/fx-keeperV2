import { ethers, Wallet } from "ethers";

const privateRpcUrls = ["https://eth.rpc.blxrbdn.com", "https://rpc.beaverbuild.org", "https://rpc.titanbuilder.xyz"];

export async function sendTx(wallet: Wallet, target: string, data: string, isPrivate: boolean) {
  const block = await wallet.provider?.getBlock("latest");
  let gasLimit;
  try {
    gasLimit = await wallet.estimateGas({ to: target, data });
  } catch (e) {
    console.log("estimateGas failed:", e);
    return;
  }
  if (isPrivate) {
    const signedTx = await wallet.signTransaction({
      to: target,
      data,
      chainId: 1,
      value: 0n,
      type: 2,
      nonce: await wallet.getNonce(),
      gasLimit: (gasLimit * 3n) / 2n,
      maxFeePerGas: block!.baseFeePerGas! * 2n,
      maxPriorityFeePerGas: ethers.parseUnits("0.1", "gwei"),
    });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_sendRawTransaction",
      params: [signedTx],
      id: 1,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    for (const privateRpcUrl of privateRpcUrls) {
      // this is async
      await fetch(privateRpcUrl, requestOptions)
        .then((response) => response.json())
        .then(async (_txHash: any) => {
          const txHash = _txHash.result;
          if (txHash) {
            console.log("sending private tx to", privateRpcUrl, "hash:", txHash);
            const receipt = await wallet.provider!.waitForTransaction(txHash, 1, 60 * 1000);
            console.log("tx confirmed, GasUsed:", receipt?.gasUsed);
          }
        })
        .catch((error) => console.log("sending private tx to", privateRpcUrl, "error", error));
    }
  } else {
    const tx = await wallet.sendTransaction({
      to: target,
      data,
      gasLimit: (gasLimit * 3n) / 2n,
      maxFeePerGas: block!.baseFeePerGas! * 2n,
      maxPriorityFeePerGas: ethers.parseUnits("0.1", "gwei"),
    });
    console.log("sending tx, hash:", tx.hash);
    const receipt = await tx.wait(1, 60 * 1000);
    console.log("tx confirmed, GasUsed:", receipt?.gasUsed);
  }
}
