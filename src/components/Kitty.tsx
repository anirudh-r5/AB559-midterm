import { useState } from 'react';
interface KittyProps {
  kittyDeets: {
    id: number;
    genes: number;
    birthTime: number;
    owner: boolean;
  };
  eatUp: boolean;
  handleClick(): void;
  handleClick(arg0: number): any;
}

const Kitty: React.FC<KittyProps> = ({ kittyDeets, handleClick, eatUp }) => {
  const [operate, setOperate] = useState(false);
  return (
    <section className="section">
      <div className="container">
        <nav
          className={`panel ${
            kittyDeets.owner === true ? 'is-primary' : 'is-danger'
          }`}
        >
          <p className="panel-heading">
            {kittyDeets.owner === true ? 'My Zombie' : 'Zombie'}
          </p>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-dna" aria-hidden="true"></i>
            </span>
            <p>Genes: {kittyDeets.genes}</p>
          </label>
          <label className="panel-block is-active">
            <span className="panel-icon">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
            </span>
            <p>Birth Time: {kittyDeets.birthTime}</p>
          </label>
          <div className="panel-block ">
            <button
              className={`button is-dark is-primary is-fullwidth ${
                operate && 'is-loading'
              }`}
              onClick={handleClick}
            >
              Eat Up!
            </button>
          </div>
          <div className="panel-block">
            {eatUp && (
              <div className="notification is-dark is-primary has-text-centered">
                <p>Your zombie ate this kitty up!</p>
              </div>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
};

export default Kitty;
