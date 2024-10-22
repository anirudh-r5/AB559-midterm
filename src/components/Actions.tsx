interface ActionProps {
  show(): void;
  create(): void;
  disable: boolean;
}

const Actions: React.FC<ActionProps> = ({ show, create, disable }) => {
  return (
    <section className="section">
      <div className="container buttons is-centered">
        <button className="button is-dark is-link" onClick={show}>
          Show Zombies
        </button>
        <button
          className="button is-dark is-danger"
          onClick={create}
          disabled={disable}
        >
          Create Zombie
        </button>
      </div>
    </section>
  );
};

export default Actions;
