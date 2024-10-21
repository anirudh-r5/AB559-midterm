import cryptoZombiesABI from 'public/cz_abi';
import { Contract } from 'web3';

/* eslint-disable react/prop-types */
interface ActionProps {
  zombie: Contract<typeof cryptoZombiesABI> | undefined;
  create(z: Contract<typeof cryptoZombiesABI>): void;
}
const Actions: React.FC<ActionProps> = ({ zombie, create }) => {
  return (
    <section className="section">
      <div className="container buttons is-centered">
        <button className="button is-dark is-link">Show Zombies</button>
        <button className="button is-dark is-danger">Create Zombie</button>
        <button className="button is-dark is-primary">Level Up!</button>
      </div>
    </section>
  );
};

export default Actions;
