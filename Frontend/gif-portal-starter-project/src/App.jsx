import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import twitterLogo from './assets/twitter-logo.svg';
import idl from './idl.json';
import { Buffer } from 'buffer';
import kp from './keypair.json'

globalThis.Buffer = Buffer

import './App.css';

// Constants
const TWITTER_HANDLE = '@cloak777';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/GRSnxyhJnPsaQy9YLn/giphy.gif',
	'https://media.giphy.com/media/SRZuUDhEPZcReTJhFn/giphy.gif',
	'https://media.giphy.com/media/VJeQrlJLcDsxnknlTP/giphy.gif',
	'https://media.giphy.com/media/1J2FKJ31JKn4I/giphy.gif',
  'https://media.giphy.com/media/IARsaTPpY5IiY/giphy.gif',
  'https://media.giphy.com/media/YX1rsNMnDvjna/giphy.gif',
  'https://media.giphy.com/media/YADs926MTnJ4s/giphy.gif'
];
// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);
// Set our network to devnet.
const network = clusterApiUrl('devnet');
// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

const App = () => {

const [inputValue, setInputValue] = useState('')
const [walletAddress, setWalletAddress] = useState(null);
const [gifList, setGifList] = useState([])
// async function to check if phantom wallet is connected i.e extension has injected the solana object
  const checkIfWalletIsConncected = async () => {
try {
  const { solana }= window;

  if (solana) {
    if (solana.isPhantom) {

    console.log("Phantom is found")

    const response = await solana.connect({onlyIfTrusted: true});
     console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        setWalletAddress(response.publicKey.toString());
    }
  } 
  else {
    alert("solana object not found. Connect phantom wallet")
  }

}  catch (error) {
console.log(error);
  }
  };


  const connectWallet = async () => {

    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("connected with publicn key", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString())
    }
  };
  const sendGif = async () => {
  if (inputValue.length === 0) {
    console.log(`no gif link YUCK`);
   return;
  }
   console.log('Gif link:', inputValue);
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.addGif(inputValue, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      }
    });
    console.log("gif successfully sent ", inputValue)
    await getGifList();
  }
  catch (error) {
    console.log(error, "this was the error in sending GIF")
  }
}
  const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};

const getProvider = () => {

  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(connection, window.solana, opts.preflightCommitment,);
  return provider
}
const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

const renderConnectedContainer = () => {
	// If we hit this, it means the program account hasn't be initialized.
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  } 
	// Otherwise, we're good! Account exists. User can submit GIFs.
	else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input className="input-link"
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <div className="gif-item-card">
            <div className="gif-item" key={index}>
              <img src={item.gifLink} />
              <a href = {item.gifLink}> {item.gifLink} </a>
              <span> <h5>Posted By: {item.userAddress.toString()}</h5> </span>
            </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

//get Gif List

const getGifList = async() => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
    setGifList(account.gifList)

  } catch (error) {
    console.log("Error in getGifList: ", error)
    setGifList(null);
  }
}

//calling useEffect hooks once on component mount and then when [] is empty
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConncected();

    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad)
  }, []);

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    getGifList()
  }
}, [walletAddress]);

  return (
    <div className="App">
     <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Daffy's Dragon Ball GIF Portal</p>
          <p className="sub-text">
           ✨ View your Dragon Ball GIF collection in the metaverse ✨
          </p>
          {/* render not connected button here if not conected*/}
            {!walletAddress && renderNotConnectedContainer()} 
            {walletAddress && renderConnectedContainer()}
            
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by ${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
