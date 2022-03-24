import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { FaBell } from 'react-icons/fa'
import Wave from './artifacts/contracts/Wave.sol/Wave.json'
import './App.css'

function App() {
  const [bounty, setBounty] = useState()
  const [balance, setBalance] = useState('--')
  const [account, setAccount] = useState('Connect Wallet First')
  const [message, setMessage] = useState('')
  const [wavesData, setWavesData] = useState([])
  const [showConnect, setShowConnect] = useState(true)
  const [bountyTimer, setBountyTimer] = useState()
  const [allowBounty, setAllowBounty] = useState(false)
  const [bountyWordsList, setBountyWordsList] = useState([])
  const waveValue = useRef(null)

  const waveAddress = '0x78De4EA97A33407Cf98a30dE3518Da57e8FcA77d'

  useEffect(async () => {
    const todayBounty = await contract().todayBounty()
    setBounty(todayBounty.toNumber() + ' WAV')
    let bountyList = await contract().getBountyWords()
    setBountyWordsList(bountyList)
    _getBountyCountdown()
    reqAccount()
  }, [window])

  function clearWave() {
    waveValue.current.value = ''
  }

  function format(seconds) {
    seconds = Number(seconds)
    let d = ~~(seconds / (3600 * 24))
    let h = ~~((seconds % (3600 * 24)) / 3600)
    let m = ~~((seconds % 3600) / 60)
    let s = ~~(seconds % 60)

    let x

    let dDisplay = d > 0 ? d + (d == 1 ? ' day ' : ' days ') : ''
    let hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : ''
    let mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : ''
    let sDisplay = s > 0 ? s + (s == 1 ? ' second ' : ' seconds ') : ''

    if (h > 0 && d <= 0) {
      x = hDisplay + mDisplay
    } else if (d > 0) {
      x = dDisplay + hDisplay
    } else {
      x = dDisplay + hDisplay + mDisplay + sDisplay
    }

    return x
  }

  function provider() {
    return new ethers.providers.Web3Provider(window.ethereum)
  }

  function signer() {
    return provider().getSigner()
  }

  function contract() {
    return new ethers.Contract(waveAddress, Wave.abi, signer())
  }

  /** Calls on Page Load */

  function breakAcc(x) {
    let y = x.length
    return x.slice(0, 6) + '...' + x.slice(y - 5, y)
  }

  async function reqAccount() {
    if (await window.ethereum._metamask.isUnlocked()) {
      login()
    } else {
      alert('Unlock your Metamask Wallet and reconnect and use this DApp.')
    }
  }

  async function login() {
    if (typeof window.ethereum != 'undefined') {
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(breakAcc(account[0]))

      _getBalance(account[0])
      _returnWaves()
      setShowConnect(false)
    } else {
      console.log('Install Metamask to use this DApp')
    }
  }

  window.ethereum.on('accountsChanged', () => {
    reqAccount()
  })

  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })

  async function _getBalance(account) {
    let balance = await contract().balanceOf(account)
    balance = ethers.utils.formatEther(balance)
    setBalance(balance + ' WAV')
    //Notice that this assumes you are formatting a number with 18 decimals (like eth itself, or most ERC20 tokens). If you wanted to format a token with a different number of decimals (like USDC, which has 6), you need to use ethers.utils.formatUnits(value, 6). formatEther is a shorthand for formatUnits(value, 18)
  }

  async function wave() {
    if (message.length > 0) {
      try {
        reqAccount()
        await contract().waveNow(message)

        contract().on('Transfer', (from, to, amount) => {
          console.log('Successfully sent ', amount, 'to ', to, 'for waving.')

          reqAccount()
          clearWave()
        })

        waveBounty()
      } catch (e) {
        if (e.message.includes('You can only wave every 15 minutes'))
          alert('Wait for 15 minutes since your last message.')
      }
    }
  }

  async function waveBounty() {
    let resultArr

    for (let i of bountyWordsList) {
      if (message.indexOf(i) !== -1 && allowBounty) {
        console.log(i)

        try {
          await contract().bountyWinner()

          contract().on('Transfer', () => {
            console.log('You won the bounty by using ' + i)
            reqAccount()
          })

          resultArr = bountyWordsList.filter((word) => word !== i)
          await contract().setBountyWords(resultArr)
          _getBountyCountdown()
        } catch (e) {
          if (e.message.includes('only be won every 3 days')) alert('')
        }
        setBountyWordsList(resultArr)
        console.log(bountyWordsList)
        break
      }
    }
  }

  async function _returnWaves() {
    const waves = await contract().getAllWaves()
    const timeNow = await contract().retTime()
    const allWinners = await contract().returnWinner()

    let allWavesArr = []
    let waveObj

    if (waves.length > 0) {
      for (let i of waves) {
        for (let w of allWinners) {
          if (w == i[2]) {
            waveObj = {
              message: i[0].toString(),
              time: format(timeNow - i[1]),
              waver: i[2],
            }
            allWavesArr[waves.indexOf(i)] = waveObj
          } else {
            waveObj = {
              message: i[0].toString(),
              time: format(timeNow - i[1]),
              waver: i[2],
            }
            allWavesArr[waves.indexOf(i)] = waveObj
          }
        }
      }
    }
    setWavesData(allWavesArr)
    reqAccount()
  }

  async function _getBountyCountdown() {
    let lastBounty = await contract().retLastBounty()
    let currentTime = await contract().retTime()

    let timePassed = currentTime - lastBounty

    if (timePassed < 259200) {
      setAllowBounty(false)
      setBountyTimer('Time since last Bounty: ' + format(timePassed))
    } else {
      setAllowBounty(true)
      setBountyTimer('Bounty Time!')
    }
  }

  return (
    <div className='App'>
      <div id='banner'>
        <code id='address'>
          {' '}
          Your Address:{' '}
          <span style={{ color: '#2534A1', opacity: '0.8' }}> {account} </span>
        </code>
        <code id='balance'>
          {' '}
          Your WAVE Balance:{' '}
          <span style={{ color: 'orangered', opacity: '0.8' }}>
            {' '}
            {balance}{' '}
          </span>
        </code>
        <code id='bounty'>
          {' '}
          Today's Bounty:{' '}
          <span
            style={{
              color: allowBounty ? 'orangered' : 'black',
              opacity: allowBounty ? '0.8' : '0.4',
            }}
          >
            {' '}
            {allowBounty ? bounty : 'Every 3 days (timer below)'}{' '}
          </span>
        </code>
        <br />
      </div>

      <div id='constHeader'>
        <h3 className='title'>
          {' '}
          Hi <span style={{ color: '#2534A1', opacity: '0.8' }}> There!</span>
        </h3>
        <p>
          {' '}
          Would you like to save the world? Good for you. Would you like to save
          yourself? That's a great start. By the way, I am Leo. Programmatically
          known as ILeoX. Type that into your command line -- you may be
          surprised what you'd find. You could leave a message to tell me
          something about me. If you're lucky, your message would contain a word
          that lets you win the bounty. <b>Goodluck. </b>
          <br />
        </p>
        <textarea
          cols='40'
          ref={waveValue}
          rows='7'
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button id='waveBtn' onClick={wave}>
          {' '}
          Wave @ Me
        </button>
        {showConnect && (
          <button id='conBtn' onClick={reqAccount}>
            {' '}
            Connect Wallet
          </button>
        )}
      </div>

      <div id='waves'>
        <h3 className='title'>
          {' '}
          My <span style={{ color: '#2534A1', opacity: '0.8' }}> Waves! </span>
        </h3>

        {wavesData.map((item, index) => {
          return (
            <div key={index} className='wave'>
              <p className='message'>{item.message}</p>
              <p className='waver'>
                {' '}
                <span> From: </span> {breakAcc(item.waver)}{' '}
                <span className='waveTime'> {item.time} ago</span>{' '}
              </p>
            </div>
          )
        })}
      </div>

      <div id='footer'>
        <code>
          {' '}
          Contract Address:{' '}
          <span
            style={{ color: 'orangered', opacity: '0.8', fontWeight: 'bold' }}
          >
            {' '}
            {waveAddress}{' '}
          </span>
        </code>
        <code>
          <span
            style={{
              color: allowBounty ? 'orangered' : 'black',
              opacity: allowBounty ? '0.8' : '0.4',
              fontWeight: 'bold',
            }}
          >
            {' '}
            {bountyTimer} <FaBell />{' '}
          </span>
        </code>
      </div>
    </div>
  )
}

export default App
