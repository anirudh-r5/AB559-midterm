import { useState } from 'react';
import { zombArr } from './zombArr';
interface ZombieProps {
  zombieDeets: {
    id: number;
    name: string;
    dna: number;
    level: number;
    readyTime: number;
    winCount: number;
    lossCount: number;
    owner: boolean;
  };
  levelUp: boolean;
  battleStatus: number;
  handleClick(): void;
  handleClick(arg0: number): any;
}

const Zombie: React.FC<ZombieProps> = ({
  zombieDeets,
  handleClick,
  levelUp,
  battleStatus,
}) => {
  const [operate, setOperate] = useState(false);
  return (
    <section className="section">
      <div className="container">
        <nav
          className={`panel ${
            zombieDeets.owner === true ? 'is-link' : 'is-danger'
          }`}
        >
          <p className="panel-heading">
            {zombieDeets.owner === true ? 'My Zombie' : 'Zombie'}
          </p>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-user" aria-hidden="true"></i>
            </span>
            <p>Name: {zombieDeets.name}</p>
          </label>
          {/* <div className='panel-block'><button className="button">Change Name</button></div> */}
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-dna" aria-hidden="true"></i>
            </span>
            <p>DNA: {zombieDeets.dna}</p>
          </label>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-turn-up" aria-hidden="true"></i>
            </span>
            <p>Level: {zombieDeets.level}</p>
          </label>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
            </span>
            <p>Ready Time: {zombieDeets.readyTime}</p>
          </label>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-trophy" aria-hidden="true"></i>
            </span>
            <p>Win Count: {zombieDeets.winCount}</p>
          </label>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i
                className="fa-solid fa-skull-crossbones"
                aria-hidden="true"
              ></i>
            </span>
            <p>Loss Count: {zombieDeets.lossCount}</p>
          </label>
          <div className="panel-block ">
            {zombieDeets.owner ? (
              <button
                className={`button is-dark is-link is-fullwidth ${
                  operate && 'is-loading'
                }`}
                onClick={handleClick}
                disabled={operate}
              >
                Level Up!
              </button>
            ) : (
              <button
                className={`button is-dark is-danger is-fullwidth ${
                  operate && 'is-loading'
                }`}
                onClick={() => handleClick(zombieDeets.id)}
                disabled={operate}
              >
                <span className="icon">
                  <i className="fa-solid fa-swords"></i>
                </span>
                <span>Fight!</span>
              </button>
            )}
          </div>
          <div className="panel-block">
            {levelUp && (
              <div className="notification is-dark is-link has-text-centered">
                <p>Your zombie levelled up!</p>
              </div>
            )}
            {battleStatus === 1 && (
              <div className="notification is-dark is-success has-text-centered">
                <p>
                  <strong>Success!</strong>
                </p>
                <p>Your zombie won the battle!</p>
              </div>
            )}
            {battleStatus === 2 && (
              <div className="notification is-dark is-danger has-text-centered">
                <p>
                  <strong>Failure!</strong>
                </p>
                <p>Your zombie lost the battle!</p>
              </div>
            )}
          </div>
          <div className="panel-block is-centered">
            <figure className="is-image is-64x64 is-centered">
              <img
                width={256}
                height={256}
                src={zombArr[(zombieDeets.dna + zombieDeets.readyTime) % 10]}
                alt="Zombie"
              />
            </figure>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default Zombie;
