import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { client } from '../config/web3'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}

export default MyApp 