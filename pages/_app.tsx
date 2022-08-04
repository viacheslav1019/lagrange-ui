/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
import 'intro.js/introjs.css'
import '../styles/index.css'
import useWallet from '../hooks/useWallet'
import useHydrateStore from '../hooks/useHydrateStore'
import Notifications from '../components/Notification'
import useMangoStore from '../stores/useMangoStore'
import useOraclePrice from '../hooks/useOraclePrice'
import { getDecimalCount } from '../utils'
import { useRouter } from 'next/router'
import { ViewportProvider } from '../hooks/useViewport'
import { appWithTranslation } from 'next-i18next'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalNotification from '../components/GlobalNotification'
import { useOpenOrders } from '../hooks/useOpenOrders'
import usePerpPositions from '../hooks/usePerpPositions'
import { useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import {
  connectionSelector,
  mangoClientSelector,
  mangoGroupSelector,
} from '../stores/selectors'
import {
  ReferrerIdRecordLayout,
  ReferrerIdRecord,
} from '@blockworks-foundation/mango-client'
import { WalletProvider, WalletListener } from '../components/WalletAdapter'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet'
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope'
import { BitpieWalletAdapter } from '@solana/wallet-adapter-bitpie'
import { HuobiWalletAdapter } from '@solana/wallet-adapter-huobi'
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow'

import 'tailwindcss/tailwind.css'
import '../styles/globals.scss'
import '../styles/pool.scss'
import '../styles/swap.scss'
import '../styles/trade.scss'
import '../styles/topbar.scss'
import '../styles/overview.scss'
import '../styles/landing.scss'
import '../styles/section6.scss'
import '../styles/footerLandingPage.scss'
import '../styles/settingsmodal.scss'

const MangoStoreUpdater = () => {
  useHydrateStore()
  return null
}

const WalletStoreUpdater = () => {
  useWallet()
  return null
}

const OpenOrdersStoreUpdater = () => {
  useOpenOrders()
  return null
}

const PerpPositionsStoreUpdater = () => {
  usePerpPositions()
  return null
}

const FetchReferrer = () => {
  const setMangoStore = useMangoStore((s) => s.set)
  const mangoClient = useMangoStore(mangoClientSelector)
  const mangoGroup = useMangoStore(mangoGroupSelector)
  const connection = useMangoStore(connectionSelector)
  const router = useRouter()
  const { query } = router

  useEffect(() => {
    const storeReferrer = async () => {
      if (query.ref && mangoGroup) {
        let referrerPk
        if (query.ref.length === 44) {
          referrerPk = new PublicKey(query.ref)
        } else {
          let decodedRefLink: string
          try {
            decodedRefLink = decodeURIComponent(query.ref as string)
          } catch (e) {
            console.log('Failed to decode referrer link', e)
          }
          const { referrerPda } = await mangoClient.getReferrerPda(
            mangoGroup,
            decodedRefLink
          )
          console.log('in App referrerPda', referrerPda)
          const info = await connection.getAccountInfo(referrerPda)
          console.log('in App referrerPda info', info)
          if (info) {
            const decoded = ReferrerIdRecordLayout.decode(info.data)
            const referrerRecord = new ReferrerIdRecord(decoded)
            referrerPk = referrerRecord.referrerMangoAccount
          }
        }
        console.log('in App referrerPk from url is:', referrerPk)
        setMangoStore((state) => {
          state.referrerPk = referrerPk
        })
      }
    }

    storeReferrer()
  }, [query, mangoGroup])

  return null
}

const PageTitle = () => {
  const router = useRouter()
  const marketConfig = useMangoStore((s) => s.selectedMarket.config)
  const market = useMangoStore((s) => s.selectedMarket.current)
  const oraclePrice = useOraclePrice()
  const selectedMarketName = marketConfig.name
  const marketTitleString =
    marketConfig && router.pathname == '/'
      ? `${
          oraclePrice
            ? oraclePrice.toFixed(getDecimalCount(market?.tickSize)) + ' | '
            : ''
        }${selectedMarketName} - `
      : ''

  return (
    <Head>
      <title>Lagrange - Home</title>
    </Head>
  )
}

function App({ Component, pageProps }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new SlopeWalletAdapter(),
      new BitpieWalletAdapter(),
      new HuobiWalletAdapter(),
      new GlowWalletAdapter(),
    ],
    []
  )

  return (
    <>
      <Head>
        <title>Lagrange</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Lagrange" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="keywords"
          content="Lagrange, Serum, SRM, Serum DEX, DEFI, Decentralized Finance, Decentralised Finance, Crypto, ERC20, Ethereum, Decentralize, Solana, SOL, SPL, Cross-Chain, Trading, Fastest, Fast, SerumBTC, SerumUSD, SRM Tokens, SPL Tokens"
        />
        <meta
          name="description"
          content="Lagrange offers a fully decentralized 24/7 FX market that does not require any broker or settlement periods."
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/apple-touch-icon.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lagrange" />
        <meta
          name="twitter:description"
          content="Lagrange offers a fully decentralized 24/7 FX market that does not require any broker or settlement periods."
        />

        <meta
          name="twitter:image"
          content="https://i.ibb.co/YtTr6zg/Lagrange-logo-dark.png"
        />
        {/* <meta
          name="twitter:image"
          content="https://www.mango.markets/socials/twitter-image-1200x600.png?34567878"
        /> */}
        <meta name="google" content="notranslate" />
        {/* <link rel="manifest" href="/manifest.json"></link> */}
      </Head>
      <ErrorBoundary>
        <PageTitle />
        <MangoStoreUpdater />
        <WalletStoreUpdater />
        <OpenOrdersStoreUpdater />
        <PerpPositionsStoreUpdater />
        <FetchReferrer />
        <ThemeProvider defaultTheme="Light">
          <WalletProvider wallets={wallets}>
            <WalletListener />
            <ViewportProvider>
              <div className="min-h-screen bg-th-bkg-1">
                <ErrorBoundary>
                  <GlobalNotification />
                  <Component {...pageProps} />
                </ErrorBoundary>
              </div>
              {/* <div className="fixed bottom-0 left-0 z-20 w-full md:hidden">
                  <ErrorBoundary>
                    <BottomBar />
                  </ErrorBoundary>
                </div>*/}

              <Notifications />
            </ViewportProvider>
          </WalletProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  )
}

export default appWithTranslation(App)
