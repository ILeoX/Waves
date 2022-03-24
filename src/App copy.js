import Kingex from './artifacts/contracts/Kingex.sol/Kingex.json'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

const kingexAddress = '0xCC36Cf726944e58f12451b49b17d9E0Bd1287088'
function App() {
  
  const[greeting, setGreetingValue] = useState() //Destructuring Assignments in React

  async function reqeustAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function fetchGreeting() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(kingexAddress, Kingex.abi, provider)
  
      try { 
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (e) {
        console.log("Error: ", e)
      }
    }
  }


  async function setGreeting () {
    if(!greeting) return

    await reqeustAccount()

    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner() 
      const contract = new ethers.Contract(kingexAddress, Kingex.abi, signer)

      try { 
        const transaction = await contract.setGreeting(greeting)
        await transaction.wait()
        //fetchGreeting
          const data = await contract.greet()
          console.log('data: ', data)
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;
