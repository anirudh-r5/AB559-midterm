interface WalletProps {
  connect(): void;
  connected: boolean;
}

const Wallet: React.FC<WalletProps> = (connect, connected) => {
  return (
    <section className="section">
      <div className="container buttons is-centered">
        <button
          className="button is-danger"
          onClick={() => connect}
          disabled={!connected}
        >
          Connect to Metamask
        </button>
      </div>
    </section>
  );
};
export default Wallet;
