import React, { useEffect, useState } from 'react';
import './App.css';
import { useSDK } from '@metamask/sdk-react';
import Title from './components/Title';
import Footer from './components/Footer';
import Wallet from './components/Wallet';
import Web3, { Contract, FMT_BYTES, FMT_NUMBER } from 'web3';

import cryptoZombiesABI from './cz_abi';
import Connector from './components/Connector';
import Actions from './components/Actions';
import { generate } from 'random-words';
import Zombie from './components/Zombie';

let zombies: Contract<typeof cryptoZombiesABI>;
function App() {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const [contractAddress, setContractAddress] = useState('');
  const [contractURL, setContractURL] = useState('');
  const [currentZombie, setCurrentZombie] = useState<any>();
  const [zombieList, setZombieList] = useState<Array<any>>();
  const [levelStatus, setLevelStatus] = useState(false);
  const [battleStatus, setBattleStatus] = useState(0);

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
    web3.eth.defaultReturnFormat = {
      bytes: FMT_BYTES.UINT8ARRAY,
      number: FMT_NUMBER.NUMBER,
    };
    zombies = new web3.eth.Contract(cryptoZombiesABI, address);
    zombies.handleRevert = true;
    if (zombies !== undefined) {
      console.log(zombies);
      zombies.events.Transfer({
        filter: { _to: account },
      });
      setContractAddress(address);
      setContractURL(url);
      await getZombiesByOwner();
    }
  };

  const createRandomZombie = async () => {
    const name = (generate(2) as string[]).join(' ');
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
    const ownerZombie = await zombies.methods
      .getZombiesByOwner(account)
      .call({ gas: '2000000' });
    if (ownerZombie === undefined || ownerZombie.length === 0) {
      setCurrentZombie('');
      return;
    }
    const id = ownerZombie?.[0];
    const zombieDetails: any[] = await zombies.methods
      .zombies(id)
      .call({ gas: '2000000' });
    const deets = {
      id: id,
      name: zombieDetails[0],
      dna: zombieDetails[1].toString(),
      level: zombieDetails[2].toString(),
      readyTime: zombieDetails[3].toString(),
      winCount: zombieDetails[4].toString(),
      lossCount: zombieDetails[5].toString(),
      owner: true,
    };
    setCurrentZombie(deets);
    return deets;
  };

  const getAllZombies = async () => {
    getZombiesByOwner();
    const zombiesIds: any[] = await zombies.methods
      .getAllZombies(account)
      .call({ gas: '2000000' });
    const allZombies: any[] = [];
    const setIds = new Set(zombiesIds);
    console.log(zombiesIds);
    for (const id of setIds.values()) {
      const checkOwner: any[] = await zombies.methods.zombieToOwner(id).call();
      console.log(checkOwner.toString());
      if (account?.toLowerCase() === checkOwner.toString().toLowerCase())
        continue;
      const zombieDetails: any[] = await zombies.methods
        .zombies(id)
        .call({ gas: '2000000' });
      const deets = {
        id: id,
        name: zombieDetails[0],
        dna: zombieDetails[1].toString(),
        level: zombieDetails[2].toString(),
        readyTime: zombieDetails[3].toString(),
        winCount: zombieDetails[4].toString(),
        lossCount: zombieDetails[5].toString(),
        owner: false,
      };
      allZombies.push(deets);
    }
    setZombieList(allZombies);
  };

  const levelUp = async () => {
    await zombies.methods
      .levelUp(currentZombie.id)
      .send({ from: account, value: Web3.utils.toWei('0.001', 'ether') })
      .on('receipt', () => {
        console.log('Power overwhelming! Zombie successfully leveled up');
        getZombiesByOwner();
        setLevelStatus(true);
        setTimeout(() => setLevelStatus(false), 5000);
      })
      .on('error', (error) => {
        console.error(error);
      });
  };

  const fightZombie = async (targetId: number) => {
    const win = currentZombie.winCount;
    const loss = currentZombie.lossCount;
    await zombies.methods
      .attack(currentZombie.id, targetId)
      .send({ from: account, gas: '300000' });
    const deets = await getZombiesByOwner();
    await getAllZombies();
    if (deets?.winCount > win) {
      setBattleStatus(1);
    } else if (deets?.lossCount > loss) {
      setBattleStatus(2);
    }
    setTimeout(() => setBattleStatus(0), 5000);
    return;
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
        <Actions
          show={getAllZombies}
          create={createRandomZombie}
          disable={currentZombie ? true : false}
        />
      )}
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              {currentZombie && (
                <Zombie
                  zombieDeets={currentZombie}
                  handleClick={levelUp}
                  levelUp={levelStatus}
                  battleStatus={battleStatus}
                />
              )}
            </div>
            <div className="column">
              {zombieList?.map((deet) => (
                <Zombie
                  zombieDeets={deet}
                  handleClick={() => fightZombie(deet.id)}
                  levelUp={false}
                  battleStatus={0}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer address={account} />
    </div>
  );
}

export default App;
