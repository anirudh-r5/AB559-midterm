export default function Footer({ address }: { address: string }) {
  return (
    <footer className="footer">
      <div className="content has-text-centered">Wallet Address: {address}</div>
    </footer>
  );
}
