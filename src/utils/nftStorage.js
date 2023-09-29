import { NFTStorage, Blob} from 'nft.storage'
import { ContractABI, ContractAddress } from "./ContractInfo.js";
import { web3 } from "./web3.js";
import { QRCodeCanvas } from "qrcode.react";


const nftStorage = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ5MjQ1NThmNmIxN2E0NDUwNmNiOWU4ZTJDRGI2YjY4MDYxOUI2QmYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjczODY1NDU4OSwibmFtZSI6Ik1hc3RlckcifQ.llx3ZkzLBEycEi35IUkKvXIn0kJ4npjydAHAG3UbtT4";
const client = new NFTStorage({ token: nftStorage })


export const storeNFT_function = async(name, year, brand, trainingcenter, district, state, productname) => {

    const metadata = {
        name: name,
        year: year,
        brand: brand,
        trainingcenter: trainingcenter,
        district: district,
        state: state,
        productname: productname
    };
    const blob = new Blob([JSON.stringify(metadata, null, "\t")], 
    {
        type: "application/json",
    });
    
    const cid = await client.storeBlob(blob)
    const url  = `https://ipfs.io/ipfs/${cid}`
    console.log(url)
    const tokenURI = url
    window.contract = await new web3.eth.Contract(ContractABI, ContractAddress);//loadContract();

    const qrcode = (
        <QRCodeCanvas
          id="qrCode"
          value={url}
          size={300}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"Q"}
        />
        );

    const transactionParameters = {
        to: ContractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, 
        //'data': window.contract.methods.mintToken(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract 
        'data': window.contract.methods.mintToken(tokenURI).encodeABI() //make call to NFT smart contract 
    };

    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash,
            message: "Check out the metadata on this link: " + url,
            url: url,
            image: qrcode,
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}   