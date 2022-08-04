/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react'

import type { NextPage } from 'next'
import Image from 'next/image'
import EURS from '../public/coin/2989.png'
import JPYC from '../public/coin/9045.png'
import TRYB from '../public/coin/5181.png'
import BRZ from '../public/coin/4139.png'
import Head from 'next/head'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'

interface Props {
  data: any
}
const Overview: NextPage<Props> = (props) => {
  const [isExpanded, toggleExpansion] = useState(true)

  const [trybAgEur, setTrybAgeur] = React.useState<string>()
  const [trybBrz, setTrybBrz] = React.useState<string>()
  const [trybUsd, setTrybUsd] = React.useState<string>()

  const [brzUsd, setBrzUsd] = React.useState<string>()
  const [brzAgeur, setBrzAgeur] = React.useState<string>()
  const [brzTryb, setBrzTryb] = React.useState<string>()

  const [ageurUsd, setAgeurUsd] = React.useState<string>()
  const [ageurTryb, setAgeurTryb] = React.useState<string>()
  const [ageurBrz, setAgeurBrz] = React.useState<string>()

  const [usdAgeur, setUsdAgeur] = React.useState<string>()
  const [usdBrz, setUsdBrz] = React.useState<string>()
  const [usdTryb, setUsdTryb] = React.useState<string>()

  async function getCurrenciesBoard() {
    const apiKey = '74676f0feb3ce4f81eda70c39b1eeaf9'
    const endpoint =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=usd-coin%2Cbrz%2Cbilira%2Cageur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
    const url = `${endpoint}&ping?x_cg_pro_api_key=${apiKey}`

    const response = await (await fetch(url)).json()

    const agEurUSD = response[1].current_price
    const trybUSD = response[2].current_price
    const brzUSD = response[3].current_price

    setTrybAgeur((trybUSD / agEurUSD).toFixed(3))
    setTrybBrz((trybUSD / brzUSD).toFixed(3))
    setTrybUsd(trybUSD.toFixed(3))

    setBrzUsd(brzUSD.toFixed(3))
    setBrzAgeur((brzUSD / agEurUSD).toFixed(3))
    setBrzTryb((brzUSD / trybUSD).toFixed(3))

    setAgeurUsd(agEurUSD.toFixed(3))
    setAgeurTryb((agEurUSD / trybUSD).toFixed(3))
    setAgeurBrz((agEurUSD / brzUSD).toFixed(3))

    setUsdAgeur((1 / agEurUSD).toFixed(3))
    setUsdBrz((1 / brzUSD).toFixed(3))
    setUsdTryb((1 / trybUSD).toFixed(3))

    console.log(response)
  }

  return (
    getCurrenciesBoard(),
    (
      <>
        <Head>
          <title>Lagrange - Market Overview</title>
          {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" />*/}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <TopBar />
        <div className="Overwiew">
          <section>
            <div className="table-border-divp">
              <div className="table-border-div">
                <table>
                  <tr>
                    <th></th>
                    <th>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="/coin/3408.png" />
                        </div>
                        USDC
                      </div>
                    </th>
                    <th>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="/coin/2989.png" />
                        </div>
                        agEUR
                      </div>
                    </th>
                    <th>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5181.png" />
                        </div>
                        TRYB
                      </div>
                    </th>
                    <th>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="/coin/4139.png" />
                        </div>
                        BRZ
                      </div>
                    </th>
                  </tr>

                  {/* ------------------------------------ */}

                  <tr>
                    <td>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="/coin/3408.png" />
                        </div>
                        USDC
                      </div>
                    </td>
                    <td>1</td>
                    <td>{usdAgeur}</td>
                    <td>{usdTryb}</td>
                    <td>{usdBrz}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="/coin/2989.png" />
                        </div>
                        agEUR
                      </div>
                    </td>
                    <td>{ageurUsd}</td>
                    <td>1</td>
                    <td>{ageurTryb}</td>
                    <td>{ageurBrz}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5181.png" />
                        </div>
                        TRYB
                      </div>
                    </td>
                    <td>{trybUsd}</td>
                    <td>{trybAgEur}</td>
                    <td>1</td>
                    <td>{trybBrz}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="image-and-coin-name">
                        <div className="img-icon">
                          <img src="/coin/4139.png" />
                        </div>
                        BRZ
                      </div>
                    </td>
                    <td>{brzUsd}</td>
                    <td>{brzAgeur}</td>
                    <td>{brzTryb}</td>
                    <td>1</td>
                  </tr>
                </table>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    )
  )
}
export default Overview
