interface ActionProps {
  show(): void;
  create(): void;
}

const Actions: React.FC<ActionProps> = ({ show, create }) => {
  return (
    <section className="section">
      <div className="container buttons is-centered">
        <button className="button is-dark is-link" onClick={show}>
          Show Zombies
        </button>
        <button className="button is-dark is-danger" onClick={create}>
          Create Zombie
        </button>
        <button className="button is-dark is-primary">Level Up!</button>
      </div>
    </section>
  );
};

export default Actions;
