import { useWeb3React, Web3ReactHooks, Web3ReactProvider, initializeConnector } from '@web3-react/core'

import { MetaMask } from '@web3-react/metamask'
import type { Connector } from '@web3-react/types'

import type { AppProps as NextAppProps } from "next/app";

import "regenerator-runtime/runtime";

function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask'
  return 'Unknown'
}

const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions) => new MetaMask(actions))

const connectors: [MetaMask][] = [
  [metaMask, metaMaskHooks],
]

export default function App({
  Component,
  pageProps,
  err,
}: NextAppProps & { err: any }) {
  // Workaround for https://github.com/vercel/next.js/issues/8592
  return (
    <Web3ReactProvider connectors={connectors}>
  <Component {...pageProps} err={err} />
  </Web3ReactProvider>
  )
}
