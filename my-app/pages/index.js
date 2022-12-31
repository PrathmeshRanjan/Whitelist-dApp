import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Web3Modal from "web3modal"
import { Contract, providers } from "ethers"
import abi from "./contract/Whitelist.json"

const contractAddress = "0xc309A60f0ec1aB2074da332515E6867831C92e42"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [numofWL, setNumofWL] = useState(0)
  const [joinedWL, setJoinedWL] = useState(false)
  const [loading, setLoading] = useState(false)
  const web3ModalRef = useRef()

  const getProviderorSigner = async(needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const {chainId} = await web3Provider.getNetwork()
      if(chainId !== 5){
        window.alert("Change network to Goerli")
      }
      if(needSigner){
        const signer = web3Provider.getSigner() 
        return signer
      }
      return web3Provider
    } catch(err){
      console.error(err)
    }
  }

  async function checkIfAddressisWL() {
    try {
      const signer = await getProviderorSigner(true)
      const whiltelistContract = new Contract (
        contractAddress,
        abi.abi,
        signer
      )
      const address = await signer.getAddress()
      const _joinedWL = await whiltelistContract.WLaddress(address)
      setJoinedWL(_joinedWL)
    } catch(err){
      console.error(err)
    }
  }

  async function getNumberofWL() {
    try {
      const provider = await getProviderorSigner()
      const whiltelistContract = new Contract (
        contractAddress,
        abi.abi,
        provider
      )
      const numberofWL = await whiltelistContract.addressesinWL()
      setNumofWL(numberofWL)
    } catch(err){
      console.error(err)
    }
  }

  async function addAddresstoWhitelist() {
    try {
      const signer = await getProviderorSigner(true)
      const whiltelistContract = new Contract (
        contractAddress,
        abi.abi,
        signer
      )
      const tx = await whiltelistContract.addAddresstoWL()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      await getNumberofWL()
      setJoinedWL(true)
    } catch(err){
      console.log(err)
    }
  }

  const renderButton = () => {
    if(walletConnected) {
      if(joinedWL) {
        return <div className={styles.description}>Thanks for joining the Whitelist!</div>
      } else if (loading) {
        <button className={styles.button}>Loading...</button>
        }
       else {
        return (
          <button onClick={addAddresstoWhitelist} className={styles.button}>Join the Waitlist!</button>
        )
      }
    }
    else {
      <button onClick={walletConnect} className={styles.button} >
        Connect Wallet
      </button>
    }
  }

  async function walletConnect() {
    try{
      await getProviderorSigner()
      setWalletConnected(true)
      checkIfAddressisWL()
      getNumberofWL()
    } catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    if(!walletConnected) {
    web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOptions: false,
      providerOptions: {}
    });
    walletConnect()
    }
  }, [walletConnected])

  return (
    <div className={styles.body}>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content='Whitelist-dApp' />
      </Head>

      <div className={styles.main}>
        
        <h1 className={styles.title}>Welcome to Plinth 2k23</h1>
        <div className={styles.description}>Delve into the era of blockchain and NFT’s with India's first of its kind Web3 Tech Fest by joining the whitelist!</div>
        <div className={styles.description}>{numofWL} people have already joined the Whitelist!</div>
        <img className={styles.image} src="./plinth.jpeg" />
        <div>{renderButton()}</div>
      </div>

      <footer className={styles.footer}>Made with &#9829; by Prathmesh</footer>
    </div>
  )
}