/* eslint-disable react/prop-types */
import { MouseEvent, useState } from 'react';

interface ConnectProps {
  connect(url: string, address: string): Promise<void>;
}

const Connector: React.FC<ConnectProps> = ({ connect }) => {
  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    setDisabled(true);
    await connect(url, addr);
  };
  const [url, setUrl] = useState('');
  const [addr, setAddr] = useState('');
  const [disabled, setDisabled] = useState(false);
  return (
    <section className="section">
      <div className="container">
        <div className="field">
          <div className="control is-expanded">
            <input
              name="connectUrl"
              className="input is-primary"
              type="text"
              placeholder="Provider/Blockchain URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="field">
          <div className="control is-expanded">
            <input
              name="contractAddr"
              className="input is-info"
              type="text"
              placeholder="Enter contract address"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="field is-grouped has-addons has-addons-centered">
          <div className="control">
            <button
              className={`button is-info ${disabled ? 'is-loading' : ''}`}
              onClick={(e) => handleClick(e)}
              disabled={disabled}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connector;
