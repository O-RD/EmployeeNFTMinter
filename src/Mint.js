import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./utils/Interact.js";
import { storeNFT_function } from "./utils/nftStorage.js"



const Minter = (props) => {
    
    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [url, setURL] = useState("");
    const [image, setImage] = useState("");



    // name, year, brand, trainingcenter, district, state, productname 
    const [WomanName, setWomanName] = useState("");
    const [Year, setYear] = useState("");
    const [Brand, setBrand] = useState("");
    const [TrainingCenter, setTrainingCenter] = useState("");
    const [Disctrict, setDistrict] = useState("");
    const [StateName, setStateName] = useState("");
    const [ProductName, setProductName] = useState("");

    function addWalletListener() {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setWallet(accounts[0]);
              setStatus("👆🏽 Write a message in the text-field above.");
            } else {
              setWallet("");
              setStatus("🦊 Connect to Metamask using the top right button.");
            }
          });
        } else {
          setStatus(
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          );
        }
      }
    
      useEffect(() => {
        // add an inner async function
        const setAddressStatus = async () => {
          try {
            const {address, status} = await getCurrentWalletConnected();
            setWallet(address)
            setStatus(status);

            addWalletListener();
          } catch (err) {
            console.log(err)
          }
        }
        //call function immediately
        setAddressStatus()
    }, []);

      const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

      const onMintPressed = async () => {
        try {
          const { status, message, url, image } = await storeNFT_function(WomanName, Year, Brand, TrainingCenter, Disctrict, StateName, ProductName);
          setStatus(status);
          setMessage(message);
          setURL(url); 
          setImage(image);
        } catch (err) {
          console.log(err)
        }
    };

// Interface
return (
  <div className="Minter">
    <button id="walletButton" onClick={connectWalletPressed}>
      {walletAddress.length > 0 ? (
        "Connected: " +
        String(walletAddress).substring(0, 6) +
        "..." +
        String(walletAddress).substring(38)
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>

    <br></br>
      <h1 id="title"> NFT Minter </h1>
      <p>
        Simply add your details, then press "Mint."
      </p>
      <form>
        <h2> Your Name:  </h2>
        <input
          type="text"
          placeholder="e.g. Simran"
          onChange={(event) => setWomanName(event.target.value)}
        />
        <h2> Year: </h2>
        <input
          type="text"
          placeholder="e.g. 2022"
          onChange={(event) => setYear(event.target.value)}
        />
        <h2> Brand Name: </h2>
        <input
          type="text"
          placeholder="e.g. Zara"
          onChange={(event) => setBrand(event.target.value)}
        />
        <h2> Training Center Name: </h2>
        <input
          type="text"
          placeholder="e.g. "
          onChange={(event) => setTrainingCenter(event.target.value)}
        />
        <h2> District Name: </h2>
        <input
          type="text"
          placeholder="e.g. "
          onChange={(event) => setDistrict(event.target.value)}
        />
        <h2> State Name: </h2>
        <input
          type="text"
          placeholder="e.g. Maharashtra"
          onChange={(event) => setStateName(event.target.value)}
        />
        <h2> Product Name: </h2>
        <input
          type="text"
          placeholder="e.g. Skirt"
          onChange={(event) => setProductName(event.target.value)}
        />


      </form>      
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
      <p>
        {message}
      </p>
      <p>
        {image}
      </p>


      <br></br>
      <br></br>
      <br></br>
      <br></br>
    
    </div>
)};

export default Minter;