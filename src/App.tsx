import React, { useEffect, useState } from 'react';
import './App.css';
import { useSDK } from '@metamask/sdk-react';
import Title from './components/Title';
import Footer from './components/Footer';
import Wallet from './components/Wallet';
import Web3, { Contract } from 'web3';

import cryptoZombiesABI from './cz_abi';
import Connector from './components/Connector';
import Actions from './components/Actions';
import { generate } from 'random-words';

let zombies: Contract<typeof cryptoZombiesABI>;
function App() {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const [contractAddress, setContractAddress] = useState('');
  const [contractURL, setContractURL] = useState('');

  const connectWallet = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn('failed to connect..', err);
    }
  };

  const connect = async (url: string, address: string) => {
    const web3 = new Web3(url);
    zombies = new web3.eth.Contract(cryptoZombiesABI, address);
    zombies.handleRevert = true;
    if (zombies !== undefined) {
      const subscription = zombies.events.Transfer({
        filter: { _to: account },
      });
      setContractAddress(address);
      setContractURL(url);
      subscription.on('data', async () => {
        try {
          const zombies = await getZombiesByOwner();
          console.log(zombies);
        } catch (err) {
          console.log(err);
        }
      });
    }
  };

  const createRandomZombie = async () => {
    console.log('Creating new zombie...');
    const name = (generate(2) as string[]).join(' ');
    console.log(zombies);

    await zombies.methods
      .createRandomZombie(name)
      .send({ from: account, gas: '200000' })
      .on('receipt', async (receipt) => {
        console.log(receipt);
        console.log('Successfully created ' + name + '!');

        const zombie = await getZombiesByOwner();
        console.log(zombie);
      })
      .on('error', function (error) {
        console.log(error);
      });
  };

  const getZombiesByOwner = async () => {
    console.log('inside');
    const temp = await zombies.methods
      .getZombiesByOwner(account)
      .call({ gas: '2000000' });
    console.log(temp);
    return temp;
  };

  useEffect(() => {
    connectWallet();
  });
  return (
    <div>
      <Title />
      {!connected && <Wallet connect={connectWallet} connected={connected} />}
      {connected && zombies === undefined && <Connector connect={connect} />}
      {contractAddress !== '' && (
        <Actions show={getZombiesByOwner} create={createRandomZombie} />
      )}
      <Footer address={account} />
    </div>
  );
}

export default App;
