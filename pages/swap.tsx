/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
import { JupiterProvider } from '@jup-ag/react-hook'
import type { NextPage } from 'next'
// @ts-ignore
import { useEffect, useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import PageBodyContainer from '../components/PageBodyContainer'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import {
  actionsSelector,
  connectionSelector,
  walletConnectedSelector,
  walletSelector,
} from '../stores/selectors'
import JupiterForm from '../components/JupiterForm'
// @ts-ignore
import { zeroKey } from '@blockworks-foundation/mango-client'
import Head from 'next/head'

const SwapMango: NextPage = (props) => {
  const [isExpanded, toggleExpansion] = useState(true)
  console.log('SwapMango props', isExpanded)

  const connection = useMangoStore(connectionSelector)
  const connected = useMangoStore(walletConnectedSelector)
  const wallet = useMangoStore(walletSelector)
  const actions = useMangoStore(actionsSelector)
  console.log('connected')
  console.log(connected)

  useEffect(() => {
    if (connected) {
      actions.fetchWalletTokens()
    }
  }, [connected])

  if (!connection) return null

  const userPublicKey =
    wallet?.publicKey && !zeroKey.equals(wallet.publicKey)
      ? wallet.publicKey
      : null

  return (
    <>
      <Head>
        <title>Lagrange - Swap</title>
        {/*  <meta name="viewport" content="initial-scale=1.0, width=device-width" />*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />*/}
      </Head>

      <>
        <TopBar />
        <JupiterProvider
          connection={connection}
          cluster="mainnet-beta"
          userPublicKey={connected ? userPublicKey : null}
        >
          <JupiterForm />
        </JupiterProvider>
        <Footer />
      </>
    </>
  )
}

export default SwapMango
