/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from 'react'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import Head from 'next/head'

import useMangoStore from '../stores/useMangoStore'
import {
  connectionSelector,
  walletConnectedSelector,
  walletSelector,
} from '../stores/selectors'
import {
  WalletError,
  WalletNotConnectedError,
} from '@solana/wallet-adapter-base'
import {
  getTokenAccountsByOwnerWithWrappedSol,
  nativeToUi,
  TokenAccount,
  zeroKey,
} from '@blockworks-foundation/mango-client'
import { sortBy, sum } from 'lodash'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import axios from 'axios'

const Pools = (props) => {
  //////-----  @token per price  $ ------/////////
  const [usdcbalance$, setUsdcbalance$] = useState(Number)
  const [ageurbalance$, setAgeurbalance$] = useState(Number)
  const [brzbalance$, setBrzbalance$] = useState(Number)
  const [usdtbalance$, setUsdtbalance$] = useState(Number)
  const [bilirabalance$, setBilirabalance$] = useState(Number)
  ////////////-----finish-----//////////////////////

  const [mybalance, setMybalance] = useState(String)

  const [displayl, setDisplayl] = useState('none')
  const [check, setCheck] = useState(false)
  const [check1, setCheck1] = useState(false)
  const [pool, setPool] = useState(undefined || Number)
  const [pool1, setPool1] = useState([])
  const [pool2, setPool2] = useState([])
  const [pool3, setPool3] = useState([])
  const [walletTokens, setWalletTokens] = useState([])
  const [tokens, setTokens] = useState([])

  const mountedStyle = { animation: 'inAnimation 250ms ease-in' }
  const unmountedStyle = {
    animation: 'outAnimation 270ms ease-out',
    animationFillMode: 'forwards',
  }
  const mountedStyle1 = { transform: 'rotate(180deg)' }
  const unmountedStyle1 = { transform: 'rotate(0deg)' }

  const wallet = useMangoStore(walletSelector)
  const connection = useMangoStore(connectionSelector)
  const connected = useMangoStore(walletConnectedSelector)
  // console.log(wallet?.publicKey?.toBase58())
  // console.log('connected')
  // console.log(connected == true)

  const gelsolbalance = async () => {}

  const fetchWalletTokens: { (): void; (): Promise<void> } =
    useCallback(async () => {
      const ownedTokens:
        | ((prevState: never[]) => never[])
        | { account: TokenAccount; uiBalance: number }[] = []
      const ownedTokenAccounts = await getTokenAccountsByOwnerWithWrappedSol(
        connection,
        // @ts-ignore
        wallet.publicKey
      )

      ownedTokenAccounts.forEach((account) => {
        const decimals = tokens.find(
          (t) => t?.address === account.mint.toString()
        )?.decimals

        const uiBalance = nativeToUi(account.amount, decimals || 6)
        ownedTokens.push({ account, uiBalance })
      })
      console.log('ownedToknes', ownedTokens)
      // @ts-ignore
      setWalletTokens(ownedTokens)
    }, [wallet, connection, tokens])

  useEffect(() => {
    if (connected) {
      fetchWalletTokens()
    }
  }, [connected])

  const inputUSDCBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        )
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const inputUSDTBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
        )
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const inputAgeurBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          'CbNYA9n3927uXUukee2Hf4tm3xxkffJPPZvGazc2EAH1'
        )
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const inputBrzBalance = () => {
    if (walletTokens.length) {
      console.log('walletTokens')
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          'FtgGSFADXBtroxq8VCausXRr2of47QBf5AS1NtZCu4GD'
        )
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const inputTrybBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          'A94X2fRy3wydNShU4dRaDyap2UuoeWJGWyATtyp61WZf'
        )
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const inputWeTokenBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          'D3bsdYS22s8xY1tunY2iJLCdrcpx3ZUaS2EJWor2sgD'
        )
        //return t.account.mint.toString() === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || null
    }
  }

  const inputWeToken1Balance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return (
          t.account.mint.toString() ===
          '5QEs2UzoefaSoCTDKaaQvce7BDyjQNaAGNs7twH3cVgPD'
        )
        //return t.account.mint.toString() === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || null
    }
  }

  useEffect(() => {
    async function fetchPool() {
      const response = await fetch('https://api.atrix.finance/api/tvl')
      const data = await response.json()
      // console.log('pool')
      // console.log(data)
      // console.log(
      //   data?.pools?.find(
      //     (item) =>
      //       item.poolKey === '65m1dv8LJDJiz7AoVfNMFaAN8PB9t2d5haoh71qVQ2Ah'
      //   )
      // )
      setPool(
        data?.pools?.find(
          (item) =>
            item.poolKey === '65m1dv8LJDJiz7AoVfNMFaAN8PB9t2d5haoh71qVQ2Ah'
        )
      )
    }

    fetchPool()
  }, [])

  useEffect(() => {
    async function fetchPool1() {
      const response = await fetch('https://api.atrix.finance/api/tvl')
      const data = await response.json()
      // console.log('pool')
      // console.log(data)
      // console.log(
      //   data?.pools?.find(
      //     (item) =>
      //       item.poolKey === '65m1dv8LJDJiz7AoVfNMFaAN8PB9t2d5haoh71qVQ2Ah'
      //   )
      // )
      setPool2(
        data?.pools?.find(
          (item) =>
            item.poolKey === 'CYPU45SXe9iBj31BhYVJhY98SaqUR3VzPa4gKVGahK1H'
        )
      )
    }

    fetchPool1()
  }, [])

  useEffect(() => {
    async function fetchPool1() {
      const response = await fetch(
        'https://public-api.solscan.io/token/holders?tokenAddress=D3bsdYS22s8xY1tunY2iJLCdrcpx3ZUaS2EJWor2sgD&offset=0&limit=10'
      )
      const res = await response.json()
      // console.log('poooooooooooooooool1')
      // console.log(res.data[0].amount)
      // console.log(res.data.map((d) => d.amount))
      setPool1(res.data.map((d) => d.amount))
      // console.log(pool1)
    }
    fetchPool1()
  }, [])

  useEffect(() => {
    async function fetchPool3() {
      const response = await fetch(
        'https://public-api.solscan.io/token/holders?tokenAddress=5QEs2UzoefaSoCTDKaaQvce7BDyjQNaAGNs7twH3cVgP&offset=0&limit=10'
      )
      const res = await response.json()
      // console.log('poooooooooooooooool3')
      // console.log(res.data[0].amount)
      // console.log(res.data.map((d) => d.amount))
      setPool3(res.data.map((d) => d.amount))
      // console.log(pool1)
    }
    fetchPool3()
  }, [])

  useEffect(() => {
    //------------USDC change usd------------///
    async function changeUsdc() {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd'
      )
      const data = await response.json()
      // console.log('usdc usd  ' + data['usd-coin'].usd)
      setUsdcbalance$(data['usd-coin'].usd.toFixed(2))
    }
    changeUsdc()

    //------------USDT change usd------------///
    async function changeUsdt() {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      )
      const data = await response.json()
      // console.log('usdt usd  ' + data.tether.usd)
      setUsdtbalance$(data.tether.usd.toFixed(2))
    }
    changeUsdt()

    //------------Ageur change usd------------///
    async function changeAgeur() {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ageur&vs_currencies=usd'
      )
      const data = await response.json()
      // console.log('ageur usd  ' + data.ageur.usd)
      setAgeurbalance$(data.ageur.usd.toFixed(2))
    }
    changeAgeur()

    //------------Brz change usd------------///
    async function changeBrz() {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=brz&vs_currencies=usd'
      )
      const data = await response.json()
      // console.log('brz usd  ' + data.brz.usd)
      setBrzbalance$(data.brz.usd.toFixed(2))
    }
    changeBrz()

    //------------Brz change usd------------///
    async function changeBilira() {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bilira&vs_currencies=usd'
      )
      const data = await response.json()
      // console.log('bilira usd  ' + data.bilira.usd)
      setBilirabalance$(data.bilira.usd.toFixed(2))
    }
    changeBilira()

    /* BiLira Balance FINISH */

    gelsolbalance()
    checkBalance()
  }, [wallet?.publicKey])

  const checkBalance = useCallback(async () => {
    if (!wallet?.publicKey) {
      throw new WalletNotConnectedError() && console.log('Wallet not connected')
      // eslint-disable-next-line no-unreachable
    }

    const walletBalance = await connection.getBalance(
      wallet?.publicKey,
      'confirmed'
    )

    const walletBalanceSOL = (walletBalance / LAMPORTS_PER_SOL).toLocaleString()
    setMybalance(walletBalanceSOL)

    if (connected == true) {
      setDisplayl('flex')
    } else {
      setDisplayl('none')
    }
  }, [connection, wallet?.publicKey])

  checkBalance()

  return (
    <>
      <Head>
        <title>Lagrange - Pools</title>
        {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" />*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <div>
        <TopBar />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className="poolcontents">
            <div className="pool0">
              <span className="title">Account Balances</span>
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>Price</th>
                    <th>Balances</th>
                    <th>Value</th>
                  </tr>
                  <tr>
                    <td>
                      <div className="loqoword">
                        <img src="/coin/3408.png" />
                        <span>USDC</span>
                      </div>
                    </td>
                    <td>${usdcbalance$}</td>
                    <td>{inputUSDCBalance()}</td>
                    <td>
                      ${Number(inputUSDCBalance() * usdcbalance$).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="loqoword">
                        <img src="/coin/825.png" />
                        <span> USDT </span>
                      </div>
                    </td>
                    <td>${usdtbalance$}</td>
                    <td>{inputUSDTBalance()}</td>
                    <td>
                      ${Number(inputUSDTBalance() * usdtbalance$).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="loqoword">
                        <img src="/coin/2989.png" />
                        <span>agEUR </span>
                      </div>
                    </td>
                    <td>${ageurbalance$}</td>
                    <td>{inputAgeurBalance()}</td>
                    <td>
                      ${Number(inputAgeurBalance() * ageurbalance$).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="loqoword">
                        <img src="/coin/5181.png" />
                        <span>TTRYB </span>
                      </div>
                    </td>
                    <td>${bilirabalance$}</td>
                    <td>{inputTrybBalance()}</td>
                    <td>
                      ${Number(inputTrybBalance() * bilirabalance$).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="loqoword">
                        <img src="/coin/4139.png" />
                        <span>BRZ </span>
                      </div>
                    </td>
                    <td>${brzbalance$}</td>
                    <td>{inputBrzBalance()}</td>
                    <td>
                      ${Number(inputBrzBalance() * brzbalance$).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pool1">
              <title>
                <span className="title">Pools</span>
                {/*<span> Pools are being tested. Please do not deposit </span>*/}
              </title>

              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Rewards APR</th>
                    <th>Total Pool Value</th>
                    <th>Value</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="section section-step">
                  <tr>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <div className="imgs">
                          <img src="/coin/4139.png" />
                          <img
                            src="/coin/192x192.png"
                            alt="LAG"
                            className="img2"
                          />
                        </div>
                        <span> WBRZ/USDL </span>
                      </div>
                    </td>
                    <td>--%</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>
                      <button
                        onClick={() => {
                          setCheck((prevCheck) => !prevCheck)
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  {check && (
                    <tr
                      className="accordtr"
                      style={check ? mountedStyle : unmountedStyle}
                    >
                      <td>
                        <figure>
                          <img src="/coin/4139.png" />
                          <span>
                            R$
                            {/*@ts-ignore */}
                            {pool?.coinTokens == undefined
                              ? 0
                              : /*@ts-ignore */
                                pool.coinTokens}
                          </span>
                        </figure>
                      </td>
                      <td>
                        <figure>
                          <img src="/coin/192x192.png" />
                          <span>
                            {/*@ts-ignore */}$
                            {pool?.pcTokens == undefined ? 0 : pool.pcTokens}
                          </span>
                        </figure>
                      </td>
                      <td>
                        <figure>
                          <span>TVL: $50000</span>
                        </figure>
                      </td>
                    </tr>
                  )}
                </tbody>

                <tbody className="section section-step">
                  <tr className="sub-header">
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <div className="imgs">
                          <img
                            src="/coin/5181.png"
                            alt="TRYB"
                            className="img1"
                          />
                          <img
                            src="/coin/192x192.png"
                            alt="LAG"
                            className="img2"
                          />
                        </div>
                        <span>TTRYB/USDL</span>
                      </div>
                    </td>
                    <td>--%</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>
                      <button
                        onClick={() => {
                          setCheck1((prevCheck) => !prevCheck)
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  {check1 && (
                    <tr
                      className="accordtr"
                      style={check1 ? mountedStyle : unmountedStyle}
                    >
                      <td>
                        <figure>
                          <img src="/coin/5181.png" />
                          <span>
                            R$
                            {/*@ts-ignore */}
                            {pool2?.coinTokens == undefined
                              ? 0
                              : /*@ts-ignore */
                                pool2.coinTokens}
                          </span>
                        </figure>
                      </td>
                      <td>
                        <figure>
                          <img src="/coin/192x192.png" />
                          <span>
                            {/*@ts-ignore */}$
                            {pool2?.pcTokens == undefined ? 0 : pool2.pcTokens}
                          </span>
                        </figure>
                      </td>
                      <td>
                        <figure>
                          <span>TVL: $50000</span>
                        </figure>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pool2" style={{ display: displayl }}>
            {!inputWeTokenBalance() && !inputWeToken1Balance() && (
              <h1>You do not own any portions</h1>
            )}

            {(inputWeTokenBalance() || inputWeToken1Balance()) && (
              <>
                <div className="titlediv">
                  <span className="title">Your Liquidity</span>
                  <button>Claim Rewards</button>
                </div>
                <div className="tablaparent">
                  <table>
                    <tr>
                      <th>Pool</th>
                      <th>Portion Amount</th>
                      <th>Portion Value </th>
                      <th>Unclaimed Rewards</th>
                      <th>Action</th>
                    </tr>
                    {inputWeTokenBalance() && (
                      <tbody className="section section-step">
                        <tr>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <div className="imgs">
                                <img src="/coin/4139.png" />
                                <img src="/coin/192x192.png" className="img2" />
                              </div>
                              <span>WBRZ/USDL</span>
                            </div>
                          </td>
                          <td>
                            {inputWeTokenBalance() == undefined
                              ? 0
                              : Number(
                                  (inputWeTokenBalance() /
                                    pool1.reduce(
                                      (total, item) => (total += item),
                                      0
                                    )) *
                                    1000000 *
                                    100
                                ).toFixed(2)}
                            %
                          </td>
                          <td>0.00 USD </td>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <div className="imgs">
                                <img src="/coin/4139.png" />
                                <img src="/coin/192x192.png" className="img2" />
                              </div>
                              <span>0.00 USD</span>
                            </div>
                          </td>
                          <td>
                            <button>Remove</button>
                          </td>
                        </tr>
                      </tbody>
                    )}

                    {inputWeToken1Balance() && (
                      <tbody className="section section-step">
                        <tr>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <div className="imgs">
                                <img src="/coin/5181.png" />
                                <img src="/coin/192x192.png" className="img2" />
                              </div>
                              <span>TTRYB/USDL</span>
                            </div>
                          </td>
                          <td>
                            {inputWeToken1Balance() == undefined
                              ? 0
                              : Number(
                                  (inputWeToken1Balance() /
                                    pool3.reduce(
                                      (total, item) => (total += item),
                                      0
                                    )) *
                                    1000000 *
                                    100
                                ).toFixed(2)}
                            %
                          </td>
                          <td>0.00 USD </td>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <div className="imgs">
                                <img src="/coin/5181.png" />
                                <img src="/coin/192x192.png" className="img2" />
                              </div>
                              <span>0.00 USD</span>
                            </div>
                          </td>
                          <td>
                            <button>Remove</button>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default Pools
