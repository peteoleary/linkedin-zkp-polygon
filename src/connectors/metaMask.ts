import { initializeConnector } from '@web3-react/core'
// import dynamic from 'next/dynamic'
// const {MetaMask} = dynamic(() => import('@web3-react/metamask'))
import { MetaMask } from '@web3-react/metamask'

export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask(actions, false))
