import Web3 from 'web3'
import { Web3Error } from '../constants'

const network = process.env.VUE_APP_NETWORK
const networkConfigs = require(`@/config/eth/network/${network}.json`)

const Web3Service = {
  init () {
    if (typeof window.ethereum !== 'undefined') {
      window.web3 = new Web3(window.ethereum)
    } else if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(window.web3.currentOwner)
    } else {
      console.warn('Non-Ethereum browser detected. You should consider trying MetaMask!')
      /* eslint-disable no-undef */
      window.web3 = new Web3(new Web3.providers.HttpProvider(networkConfigs.provider))
    }
  },

  async connectToMetaMask () {
    return new Promise((resolve, reject) => {
      if (!this.isSupportedBrowser()) {
        reject(Web3Error.BROWSER_NOT_SUPPORT)
        return
      }
      if (!this.isMetaMaskInstalled()) {
        reject(Web3Error.META_MASK_NOT_INSTALLED)
        return
      }
      resolve()
    }).then(() => {
      return window.web3.eth.requestAccounts()
    }).then(accounts => {
      return accounts[0]
    })
  },

  async checkRole () {
    let hasRole = true
    let message = null

    const network = await this.getNetwork()
    if (network !== networkConfigs.network) {
      hasRole = false
      message = `Chain require is ${networkConfigs.chainName} network. Check your MetaMask and reload again.`
    } else {
      const owner = await this.readContract('owner', [])
      const accounts = await window.web3.eth.requestAccounts()
      if (owner !== accounts[0]) {
        hasRole = false
        message = 'The currenct account is not the owner. Check your Metamask and reload again.'
      }
    }

    return {
      hasRole,
      message,
    }
  },

  async sendTransaction (methodName, params) {
    const metaMaskAddress = await this.connectToMetaMask()
    const contract = this.getContractInstance(this.getWeb3InstanceWithMetaMask())

    return new Promise((resolve, reject) => {
      contract.methods[methodName](...params)
        .send({ from: metaMaskAddress })
        .once('transactionHash', txid => {
          resolve({ txid })
        })
        .on('error', err => {
          reject(err)
        })
    })
  },
  async readContract (methodName, params) {
    const contract = this.getContractInstance(window.web3)
    const response = await contract.methods[methodName](...params).call()
    return response
  },

  // async getRawTransactionByHash (txid) {
  //   const result = await axios.post(networkConfigs.provider, {
  //     jsonrpc: '2.0',
  //     method: 'eth_getTransactionByHash',
  //     params: [txid],
  //     id: 1,
  //   }, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   console.log('===', result)
  //   return result
  // },

  getContractInstance (web3Instance) {
    const contractAbi = require('@/abi/FastyToken.json').abi
    const contractAddress = networkConfigs.tokenContractAddress
    return new web3Instance.eth.Contract(contractAbi, contractAddress)
  },

 async getNetwork () {
    const web3 = this.getWeb3InstanceWithMetaMask()
    return web3.eth.net.getNetworkType()
  },

  getWeb3InstanceWithMetaMask () {
    return new Web3(window.ethereum)
  },

  handleError (err, action) {
    switch (err) {
      case Web3Error.BROWSER_NOT_SUPPORT:
        action({
          show: true,
          msg: "Browser doesn't support MetaMask, please try FireFox, Chrome or Brave then install MetaMask extension for the browser.",
          alertType: Web3Error.BROWSER_NOT_SUPPORT,
        })
        break
      case Web3Error.META_MASK_NOT_INSTALLED:
        action({
          show: true,
          msg: 'MetaMask not found! Please install Metamask to continue.',
          alertType: Web3Error.META_MASK_NOT_INSTALLED,
        })
        break
      case Web3Error.CONNECTION_TIME_OUT:
        action({
          show: true,
          msg: 'Failed to connect to MetaMask, please try again.',
          alertType: Web3Error.CONNECTION_TIME_OUT,
        })
        break
      default:
        break
    }
  },

  isMetaMaskInstalled () {
    return typeof window.ethereum !== 'undefined'
  },

  isSupportedBrowser () {
    return this.isFirefox() || this.isChrome()
  },

  isFirefox () {
    return typeof InstallTrigger !== 'undefined'
  },

  isChrome () {
    return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
  },
}

export default Web3Service
