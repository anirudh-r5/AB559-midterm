interface ActionProps {
  show(): void;
  create(): void;
  kitty(): void;
}

const Actions: React.FC<ActionProps> = ({ show, create, kitty }) => {
  return (
    <section className="section">
      <div className="container buttons is-centered">
        <button className="button is-dark is-link" onClick={show}>
          Show All Zombies
        </button>
        <button className="button is-dark is-danger" onClick={create}>
          Create Zombie
        </button>
        <button className="button is-dark is-primary" onClick={kitty}>
          Create Kitty
        </button>
      </div>
    </section>
  );
};

export default Actions;
