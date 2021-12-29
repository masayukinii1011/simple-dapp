import { ethers } from "hardhat";

import { expect } from "chai";

describe("Greeter", function () {
  this.timeout(60 * 1000); // タイムアウトを延ばすため追加
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    // コントラクトをデプロイしたトランザクションをブロックチェーンエクスプローラーで確認するための情報出力追加
    console.log(
      `Greeter Deploy Tx: https://.ropsten.io/tx/${greeter.deployTransaction.hash}`
    );
    console.log(`Greeter Contract Address: ${greeter.address}`);

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();
    // コントラクトを呼び出して挨拶文を変更したトランザクションをブロックチェーンエクスプローラーで確認するための情報出力追加
    console.log(
      `setGreetingTx: https://ropsten.etherscan.io/tx/${setGreetingTx.hash}`
    );

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
