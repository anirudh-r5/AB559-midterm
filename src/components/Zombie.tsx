interface ZombieProps {
  zombieDeets: {
    name: string;
    dna: number;
    level: number;
    readyTime: number;
    winCount: number;
    lossCount: number;
    owner: boolean;
  };
}

const Zombie: React.FC<ZombieProps> = ({ zombieDeets }) => {
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
            {zombieDeets.owner && (
              <button className="button is-dark is-primary is-fullwidth">
                Level Up!
              </button>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
};

export default Zombie;
