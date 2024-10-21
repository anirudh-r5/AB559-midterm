import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

import appStylesHref from './app.css?url';
import Title from './components/Title';
import Footer from './components/Footer';
import Connector from './components/Connector';

import { MetaMaskSDK } from '@metamask/sdk';
import { generate } from 'random-words';

import { Contract, Web3 } from 'web3';
import cryptoZombiesABI from 'public/cz_abi.js';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
];
let zombies: Contract<typeof cryptoZombiesABI>;
export default function App() {
  const [account, setAccount] = useState<string>('-');
  const [contractAddress, setContractAddress] = useState('');
  const [contractURL, setContractURL] = useState('');

  const connectContract = async (url: string, address: string) => {
    const web3 = new Web3(url);
    console.log(cryptoZombiesABI);
    zombies = new web3.eth.Contract(cryptoZombiesABI, address);
    console.log(zombies);
    if (zombies != undefined) {
      const subscription = zombies.events.Transfer({
        filter: { _to: account },
      });
      subscription.on('data', async () => {
        try {
          const zombies = await getZombiesByOwner();
          console.log(zombies);
        } catch (err) {
          console.log(err);
        }
      });
      setContractAddress(address);
      setContractURL(url);
    }
  };
  const getZombiesByOwner = async () => {
    const temp = await zombies.methods
      .getZombiesByOwner(account)
      .call({ gas: 2000000 });
    return temp;
  };
  const createRandomZombie = async () => {
    console.log('Creating new zombie...');
    const name = (generate(2) as string[]).join(' ');
    console.log(zombies);

    return zombies.methods
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

  function levelUp(zombieId: string) {
    console.log('Leveling up your zombie...');
    return zombies.methods
      .levelUp(zombieId)
      .send({ from: account, value: Web3.utils.toWei('0.001', 'ether') })
      .on('receipt', function (receipt) {
        console.log('Power overwhelming! Zombie successfully leveled up');
      })
      .on('error', function (error) {
        console.log(error);
      });
  }

  const getWallet = async () => {
    try {
      const MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: 'JavaScript example dapp',
          url: 'http://localhost:7545',
        },
        // Other options.
      });
      const accounts = await window?.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((err) => {
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
      setAccount(accounts[0]);
    } catch (err) {
      console.warn('failed to connect..', err);
    }
  };

  useEffect(() => {
    getWallet();
  });

  return (
    <html lang="en-US">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <Title />
        {contractAddress ? (
          <section className="section">
            <div className="container buttons is-centered">
              <button
                className="button is-dark is-link"
                onClick={getZombiesByOwner}
              >
                Show Zombies
              </button>
              <button
                className="button is-dark is-danger"
                onClick={createRandomZombie}
              >
                Create Zombie
              </button>
              <button className="button is-dark is-primary">Level Up!</button>
            </div>
          </section>
        ) : (
          <Connector connect={connectContract} />
        )}
        <Footer address={account} />
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
