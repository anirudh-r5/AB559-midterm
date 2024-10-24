import { useEffect, useState } from 'react';
import './App.css';
import { useSDK } from '@metamask/sdk-react';
import Title from './components/Title';
import Footer from './components/Footer';
import Wallet from './components/Wallet';
import Web3, { Contract, FMT_BYTES, FMT_NUMBER } from 'web3';

import cryptoZombiesABI from './cz_abi1';
import Connector from './components/Connector';
import Actions from './components/Actions';
import Zombie from './components/Zombie';
import Kitty from './components/Kitty';
import adj from './components/Adjective';

let zombies: Contract<typeof cryptoZombiesABI>;
let currentZombieIdx = 0;
let currentKittyIdx = 0;
function App() {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const [contractAddress, setContractAddress] = useState('');
  const [contractURL, setContractURL] = useState('');
  const [currentZombie, setCurrentZombie] = useState<any>();
  const [currentZombieList, setCurrentZombieList] = useState<any[]>();
  const [currentKitty, setCurrentKitty] = useState<any>();
  const [currentKittyList, setCurrentKittyList] = useState<any[]>();
  const [feedStatus, setFeedStatus] = useState(false);
  const [zombieList, setZombieList] = useState<Array<any>>();
  const [levelStatus, setLevelStatus] = useState(false);
  const [battleStatus, setBattleStatus] = useState(0);

  const getRandomInt = () => {
    const min = Math.ceil(0);
    const max = Math.floor(adj.length);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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
      await getKittiesByOwner();
    }
  };

  const createRandomZombie = async () => {
    const name = adj[getRandomInt()] + ' Zombie';
    await zombies.methods
      .createRandomZombie(name)
      .send({ from: account, gas: '200000' })
      .on('receipt', async (receipt) => {
        await getZombiesByOwner();
        currentZombieIdx = 0;
      })
      .on('error', function (error) {
        console.log(error);
      });
  };

  const getZombiesByOwner = async () => {
    const zombiesIds = await zombies.methods
      .getZombiesByOwner(account)
      .call({ gas: '2000000' });
    if (zombiesIds === undefined || zombiesIds.length === 0) {
      setCurrentZombie('');
      return;
    }
    const allZombies: any[] = [];
    const setIds = new Set(zombiesIds);
    for (const id of setIds.values()) {
      const checkOwner: any[] = await zombies.methods.zombieToOwner(id).call();
      if (account?.toLowerCase() !== checkOwner.toString().toLowerCase())
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
        owner: true,
      };
      allZombies.push(deets);
    }
    setCurrentZombie(allZombies[0]);
    setCurrentZombieList(allZombies);
    currentZombieIdx = 0;
    return allZombies[0];
  };

  const renderOwnerZombies = (zIter: number) => {
    if (zIter === 1) {
      const len = currentZombieList?.length || 0;
      if (currentZombieIdx + 1 >= len) return;
      currentZombieIdx++;
      setCurrentZombie(currentZombieList?.[currentZombieIdx]);
    } else if (zIter === 0) {
      if (currentZombieIdx - 1 < 0) return;
      currentZombieIdx--;
      setCurrentZombie(currentZombieList?.[currentZombieIdx]);
    }
  };

  const getAllZombies = async () => {
    getZombiesByOwner();
    currentZombieIdx = 0;
    const zombiesIds: any[] = await zombies.methods
      .getAllZombies(account)
      .call({ gas: '2000000' });
    const allZombies: any[] = [];
    const setIds = new Set(zombiesIds);
    for (const id of setIds.values()) {
      const checkOwner: any[] = await zombies.methods.zombieToOwner(id).call();
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

  const createRandomKitty = async () => {
    const name = adj[getRandomInt()] + ' Kitty';
    await zombies.methods
      .createKitty(name)
      .send({ from: account, gas: '200000' })
      .on('receipt', async (receipt) => {
        console.log(receipt);
        console.log('Successfully created ' + name + '!');

        const zombie = await getKittiesByOwner();
        console.log(zombie);
      })
      .on('error', function (error) {
        console.log(error);
      });
    currentKittyIdx = 0;
  };

  const getKittiesByOwner = async () => {
    const kittyIds = await zombies.methods
      .getKittiesByOwner(account)
      .call({ gas: '2000000' });
    if (kittyIds === undefined || kittyIds.length === 0) {
      setCurrentKitty('');
      return;
    }
    const allKitties: any[] = [];
    const setIds = new Set(kittyIds);
    for (const id of setIds.values()) {
      const checkOwner: any[] = await zombies.methods.kittyToOwner(id).call();
      if (account?.toLowerCase() !== checkOwner.toString().toLowerCase())
        continue;
      const kittyDetails: any[] = await zombies.methods
        .kitties(id)
        .call({ gas: '2000000' });
      const deets = {
        id: id,
        genes: kittyDetails[0].toString(),
        birthTime: kittyDetails[1].toString(),
        owner: true,
      };
      allKitties.push(deets);
    }
    setCurrentKitty(allKitties[0]);
    setCurrentKittyList(allKitties);
    currentKittyIdx = 0;
    return allKitties[0];
  };

  const feedKitty = async () => {
    await zombies.methods
      .eatUp(currentZombie.id, currentKitty.genes, 'Fed ' + currentZombie.name)
      .send({ from: account, value: Web3.utils.toWei('0.001', 'ether') })
      .on('receipt', () => {
        console.log('Nom Nom! Zombie fed!');
        getKittiesByOwner();
        getZombiesByOwner();
        setFeedStatus(true);
        setTimeout(() => setFeedStatus(false), 5000);
      })
      .on('error', (error) => {
        console.error(error);
      });
  };

  const renderOwnerKitties = (kIter: number) => {
    if (kIter === 1) {
      const len = currentKittyList?.length || 0;
      if (currentKittyIdx + 1 >= len) return;
      currentKittyIdx++;
      setCurrentKitty(currentKittyList?.[currentKittyIdx]);
    } else if (kIter === 0) {
      if (currentKittyIdx - 1 < 0) return;
      currentKittyIdx--;
      setCurrentKitty(currentKittyList?.[currentKittyIdx]);
    }
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
          kitty={createRandomKitty}
        />
      )}
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              {currentZombie && (
                <div>
                  <nav
                    className="pagination"
                    role="navigation"
                    aria-label="pagination"
                  >
                    <button
                      className="button pagination-previous is-link"
                      onClick={() => renderOwnerZombies(0)}
                    >
                      Previous
                    </button>
                    <button
                      className="button pagination-next is-link"
                      onClick={() => renderOwnerZombies(1)}
                    >
                      Next
                    </button>
                  </nav>
                  <Zombie
                    zombieDeets={currentZombie}
                    handleClick={levelUp}
                    levelUp={levelStatus}
                    battleStatus={battleStatus}
                  />
                </div>
              )}
            </div>
            <div className="column is-one-third">
              {zombieList?.map((deet) => (
                <Zombie
                  zombieDeets={deet}
                  handleClick={() => fightZombie(deet.id)}
                  levelUp={false}
                  battleStatus={0}
                />
              ))}
            </div>
            <div className="column is-one-third">
              {currentKitty && (
                <div>
                  <nav
                    className="pagination"
                    role="navigation"
                    aria-label="pagination"
                  >
                    <button
                      className="button pagination-previous is-link"
                      onClick={() => renderOwnerKitties(0)}
                    >
                      Previous
                    </button>
                    <button
                      className="button pagination-next is-link"
                      onClick={() => renderOwnerKitties(1)}
                    >
                      Next
                    </button>
                  </nav>
                  <Kitty
                    kittyDeets={currentKitty}
                    handleClick={feedKitty}
                    eatUp={feedStatus}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer address={account} />
    </div>
  );
}

export default App;
