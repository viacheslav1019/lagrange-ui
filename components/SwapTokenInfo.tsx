/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
import {
  FunctionComponent,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ExternalLinkIcon, EyeOffIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Disclosure } from '@headlessui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import useDimensions from 'react-cool-dimensions'
import { IconButton } from './Button'
import { LineChartIcon } from './icons'

dayjs.extend(relativeTime)

interface SwapTokenInfoProps {
  inputTokenId?: any
  outputTokenId?: any
}

export const numberFormatter = Intl.NumberFormat('en', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 5,
})

export const numberCompacter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

const SwapTokenInfo: FunctionComponent<SwapTokenInfoProps> = ({
  inputTokenId,
  outputTokenId,
}) => {
  const [native, setNative] = useState('')
  const [chartData, setChartData] = useState([])
  const [hideChart, setHideChart] = useState(false)
  const [baseTokenId, setBaseTokenId] = useState('')
  const [quoteTokenId, setQuoteTokenId] = useState('')
  const [inputTokenInfo, setInputTokenInfo] = useState(null)
  const [outputTokenInfo, setOutputTokenInfo] = useState(null)
  const [mouseData, setMouseData] = useState<string | null>(null)
  const [daysToShow, setDaysToShow] = useState(1)
  const [topHolders, setTopHolders] = useState(null)
  const { observe, width, height } = useDimensions()

  const getTopHolders = async (inputMint: any, outputMint: any) => {
    const inputResponse = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${inputMint}&offset=0&limit=10`
    )
    const outputResponse = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${outputMint}&offset=0&limit=10`
    )
    const inputData = await inputResponse.json()
    const outputData = await outputResponse.json()

    setTopHolders({
      // @ts-ignore
      inputHolders: inputData.data,
      outputHolders: outputData.data,
    })
  }
  ///// date function
  const onNativeChange = (e) => {
    console.log('onNativeChange: ', e.target.value)
    setNative(e.target.value)
  }

  useEffect(() => {
    var today = new Date()
    var date =
      today.getFullYear() +
      '-0' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate()
    console.log('2022-05-18')
    console.log(
      `${today.getFullYear()}-0${today.getMonth() + 1}-${today.getDate()}`
    )
    // setNative("2022-04-18");
    setNative(date)
  }, [])
  //////

  useEffect(() => {
    if (inputTokenInfo && outputTokenInfo) {
      getTopHolders(
        // @ts-ignore
        inputTokenInfo.contract_address, // @ts-ignore
        outputTokenInfo.contract_address
      )
    }
  }, [inputTokenInfo, outputTokenInfo])

  const handleMouseMove = (coords: {
    activePayload: { payload: SetStateAction<string | null> }[]
  }) => {
    if (coords.activePayload) {
      setMouseData(coords.activePayload[0].payload)
    }
  }

  const handleMouseLeave = () => {
    setMouseData(null)
  }

  useEffect(() => {
    if (['usd-coin', 'tether'].includes(inputTokenId)) {
      setBaseTokenId(outputTokenId)
      setQuoteTokenId(inputTokenId)
    } else {
      setBaseTokenId(inputTokenId)
      setQuoteTokenId(outputTokenId)
    }
  }, [inputTokenId, outputTokenId])

  // Use ohlc data

  const getChartData = async () => {
    // tokenleri aldiq /////
    const inputResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${baseTokenId}/ohlc?vs_currency=usd&days=${daysToShow}`
    )
    const outputResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${quoteTokenId}/ohlc?vs_currency=usd&days=${daysToShow}`
    )
    const inputData = await inputResponse.json()
    const outputData = await outputResponse.json()
    // console.log(inputData)
    /// tokenleri birlesdirdik bir arraya //////
    let data: any[] = []
    if (Array.isArray(inputData)) {
      data = data.concat(inputData)
    }
    if (Array.isArray(outputData)) {
      data = data.concat(outputData)
    }
    //// tokenler format edirik ////
    const formattedData = data.reduce((a, c) => {
      const found = a.find((price: { time: any }) => price.time === c[0])
      if (found) {
        if (['usd-coin', 'tether'].includes(quoteTokenId)) {
          found.price = found.inputPrice / c[4]
        } else {
          found.price = c[4] / found.inputPrice
        }
      } else {
        a.push({ time: c[0], inputPrice: c[4] })
      }
      return a
    }, [])

    formattedData[formattedData.length - 1].time = Date.now()
    setChartData(formattedData.filter((d: { price: any }) => d.price))
  }

  const getInputTokenInfo = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${inputTokenId}?localization=false&tickers=false&developer_data=false&sparkline=false
      `
    )
    const data = await response.json()
    setInputTokenInfo(data)
  }

  const getOutputTokenInfo = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${outputTokenId}?localization=false&tickers=false&developer_data=false&sparkline=false
      `
    )
    const data = await response.json()
    setOutputTokenInfo(data)
  }

  useMemo(() => {
    if (baseTokenId && quoteTokenId) {
      getChartData()
    }
  }, [daysToShow, baseTokenId, quoteTokenId])

  useMemo(() => {
    if (baseTokenId) {
      getInputTokenInfo()
    }
    if (quoteTokenId) {
      getOutputTokenInfo()
    }
  }, [baseTokenId, quoteTokenId])

  const chartChange = chartData.length
    ? ((chartData[chartData.length - 1]['price'] - chartData[0]['price']) /
        chartData[0]['price']) *
      100
    : 0

  return (
    <>
      <div className="SwapTokenInfo1">
        {chartData.length && baseTokenId && quoteTokenId ? (
          <div>
            {!hideChart ? (
              <div
                className="w-full"
                ref={observe}
                style={{
                  borderRadius: '4px',
                  fontSize: '25px',
                }}
              >
                {/* symbol and date */}
                {inputTokenInfo && outputTokenInfo ? (
                  <div className="symbolanddate">
                    <span>
                      {`${
                        // @ts-ignore
                        outputTokenInfo?.symbol?.toUpperCase()
                      }/${inputTokenInfo?.symbol?.toUpperCase()}`}
                    </span>
                    <div className="dates">
                      <button onClick={() => setDaysToShow(1)}>24H</button>
                      <button onClick={() => setDaysToShow(7)}>7D</button>
                      <button onClick={() => setDaysToShow(30)}>30D</button>
                      <input
                        type="date"
                        value={native}
                        onChange={onNativeChange}
                      />
                    </div>
                  </div>
                ) : null}

                {/* chart number */}
                {mouseData ? (
                  <>
                    <div className="chartnumber">
                      <span>
                        {
                          // @ts-ignore
                          numberFormatter.format(mouseData['price'])
                        }
                      </span>
                      <span className={`${chartChange >= 0 ? 'green' : 'red'}`}>
                        {chartChange.toFixed(2)}%
                      </span>
                      <span>
                        {
                          // @ts-ignore
                          dayjs(mouseData['time']).format('DD MMM YY, h:mma')
                        }
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="chartnumber">
                      <span>
                        {numberFormatter.format(
                          chartData[chartData.length - 1]['price']
                        )}
                      </span>
                      <span
                        className={` ${chartChange >= 0 ? 'green' : 'red'}`}
                      >
                        {chartChange.toFixed(2)}%
                      </span>
                      <span>
                        {dayjs(chartData[chartData.length - 1]['time']).format(
                          'DD MMM YY, h:mma'
                        )}
                      </span>
                    </div>
                  </>
                )}

                {/* chart  */}
                <div className="allchartnumber">
                  <div className="chartandnumber">
                    <ul>
                      <li>$40 k</li>
                      <li>$30 k</li>
                      <li>$20 k</li>
                      <li>$10 k</li>
                      <li>$0 k</li>
                    </ul>
                    <ResponsiveContainer width="93%" height={162}>
                      <AreaChart
                        className="AreaChart"
                        data={chartData} // @ts-ignore
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Tooltip
                          cursor={{
                            strokeOpacity: 0,
                          }}
                          content={<></>}
                        />
                        <defs>
                          <linearGradient
                            id="gradientArea"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgba(253, 159, 129, 0.33) "
                              stopOpacity={1}
                            />
                            <stop
                              offset="90%"
                              stopColor="rgba(253, 159, 129, 0.33)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          isAnimationActive={true}
                          type="monotone"
                          dataKey="price"
                          stroke="#FD9F81"
                          fill="url(#gradientArea)"
                        />
                        <XAxis dataKey="time" hide />
                        <YAxis
                          dataKey="price"
                          type="number"
                          domain={['dataMin', 'dataMax']}
                          hide
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="ul">
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sut</li>
                    <li>Sun</li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-4 mt-4 text-center rounded-md bg-th-bkg-3 md:mt-0 text-th-fgd-3">
            <LineChartIcon className="w-6 h-6 mx-auto text-th-primary" />
          </div>
        )}
      </div>

      {/* accordion */}
      <div className="Disclosures">
        {inputTokenInfo && outputTokenInfo && baseTokenId ? (
          <div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className={` DisclosureButton`}>
                    <ul>
                      <li>
                        {
                          // @ts-ignore
                          inputTokenInfo.image?.small ? (
                            <img
                              // @ts-ignore
                              src={inputTokenInfo.image?.small}
                              alt={inputTokenInfo.name}
                            />
                          ) : null
                        }
                      </li>

                      <li className="selecttokenname">
                        {
                          // @ts-ignore
                          inputTokenInfo?.symbol?.toUpperCase()
                        }
                      </li>

                      <li>
                        {
                          // @ts-ignore
                          inputTokenInfo.market_data?.current_price?.usd ? (
                            <div className="selectnumber">
                              $
                              {numberFormatter.format(
                                // @ts-ignore
                                inputTokenInfo.market_data?.current_price.usd
                              )}
                            </div>
                          ) : null
                        }
                      </li>

                      <li>
                        {
                          // @ts-ignore
                          inputTokenInfo.market_data // @ts-ignore
                            ?.price_change_percentage_24h ? (
                            <div
                              id="selectnumber1"
                              className={`${
                                inputTokenInfo.market_data // @ts-ignore
                                  .price_change_percentage_24h >= 0
                                  ? 'green'
                                  : 'red'
                              }`}
                            >
                              {
                                // @ts-ignore
                                inputTokenInfo.market_data.price_change_percentage_24h.toFixed(
                                  2
                                )
                              }
                              %
                            </div>
                          ) : null
                        }
                      </li>
                    </ul>

                    <ChevronDownIcon
                      style={{ height: '30px' }}
                      className={`default-transition text-th-fgd-3 ${
                        open ? 'transform rotate-180' : 'transform rotate-360'
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="DisclosurePanel">
                      <div style={{ fontSize: '18px' }}>Market data</div>
                      <ul className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        {
                          // @ts-ignore
                          inputTokenInfo.market_cap_rank ? (
                            <li>
                              <div className="parent">
                                <span> market-cap-rank</span>
                                <span>
                                  {' '}
                                  #
                                  {
                                    // @ts-ignore
                                    inputTokenInfo.market_cap_rank
                                  }
                                </span>
                              </div>
                            </li>
                          ) : null
                        }

                        {
                          // @ts-ignore
                          inputTokenInfo.market_data?.market_cap &&
                          // @ts-ignore
                          inputTokenInfo.market_data?.market_cap?.usd !== 0 ? (
                            <li>
                              <div className="parent">
                                <span>market-cap</span>
                                <span>
                                  $
                                  {
                                    // @ts-ignore
                                    numberCompacter.format(
                                      // @ts-ignore
                                      inputTokenInfo.market_data?.market_cap
                                        ?.usd
                                    )
                                  }
                                </span>
                              </div>
                            </li>
                          ) : null
                        }

                        {
                          // @ts-ignore
                          inputTokenInfo.market_data?.total_volume?.usd ? (
                            <li>
                              <div className="parent">
                                <span>daily-volume</span>
                                <span>
                                  $
                                  {numberCompacter.format(
                                    // @ts-ignore
                                    inputTokenInfo.market_data?.total_volume
                                      ?.usd
                                  )}
                                </span>
                              </div>
                            </li>
                          ) : null
                        }

                        {
                          // @ts-ignore
                          inputTokenInfo.market_data?.circulating_supply ? (
                            <li>
                              <div className="parent">
                                <span>token-supply</span>
                                <span>
                                  {numberCompacter.format(
                                    // @ts-ignore
                                    inputTokenInfo.market_data
                                      .circulating_supply
                                  )}
                                </span>
                                {
                                  // @ts-ignore
                                  inputTokenInfo.market_data?.max_supply ? (
                                    <div className="text-xs text-th-fgd-2">
                                      max-supply:
                                      {
                                        // @ts-ignore
                                        numberCompacter.format(
                                          // @ts-ignore
                                          inputTokenInfo.market_data.max_supply
                                        )
                                      }
                                    </div>
                                  ) : null
                                }
                              </div>
                            </li>
                          ) : null
                        }

                        {
                          // @ts-ignore
                          inputTokenInfo.market_data?.ath?.usd ? (
                            <li>
                              <div className="parent">
                                <span>ath</span>

                                <div className="difparent">
                                  <div className="dif3">
                                    {
                                      // @ts-ignore
                                      inputTokenInfo.market_data?.ath_date
                                        ?.usd ? (
                                        <div>
                                          {dayjs(
                                            // @ts-ignore
                                            inputTokenInfo.market_data.ath_date
                                              .usd
                                          ).fromNow()}
                                        </div>
                                      ) : null
                                    }
                                  </div>

                                  <div className="dif2">
                                    {
                                      // @ts-ignore
                                      inputTokenInfo.market_data
                                        ?.ath_change_percentage?.usd ? (
                                        <div
                                          className={`mt-1.5 ml-1.5  ${
                                            // @ts-ignore
                                            inputTokenInfo.market_data
                                              ?.ath_change_percentage?.usd >= 0
                                              ? 'green'
                                              : 'red'
                                          }`}
                                        >
                                          {(inputTokenInfo.market_data?.ath_change_percentage?.usd) // @ts-ignore
                                            .toFixed(2)}
                                          %
                                        </div>
                                      ) : null
                                    }
                                  </div>
                                  <div className="dif1">
                                    $
                                    {numberFormatter.format(
                                      // @ts-ignore
                                      inputTokenInfo.market_data.ath.usd
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ) : null
                        }

                        {
                          // @ts-ignore
                          inputTokenInfo.market_data?.atl?.usd ? (
                            <li>
                              <div className="parent">
                                <span>atl</span>
                                <div className="difparent">
                                  <div className="dif3">
                                    {
                                      // @ts-ignore
                                      inputTokenInfo.market_data?.atl_date
                                        ?.usd ? (
                                        <div>
                                          {dayjs(
                                            // @ts-ignore
                                            inputTokenInfo.market_data.atl_date
                                              .usd
                                          ).fromNow()}
                                        </div>
                                      ) : null
                                    }
                                  </div>

                                  <div className="dif2">
                                    {
                                      // @ts-ignore
                                      inputTokenInfo.market_data
                                        ?.atl_change_percentage?.usd ? (
                                        <div
                                          className={`ml-1.5 mt-1.5  ${
                                            // @ts-ignore
                                            inputTokenInfo.market_data
                                              ?.atl_change_percentage?.usd >= 0
                                              ? 'green'
                                              : 'red'
                                          }`}
                                        >
                                          {(inputTokenInfo.market_data?.atl_change_percentage?.usd).toLocaleString(
                                            undefined,
                                            {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                          %
                                        </div>
                                      ) : null
                                    }
                                  </div>

                                  <div className="dif1">
                                    $
                                    {
                                      // @ts-ignore
                                      numberFormatter.format(
                                        // @ts-ignore
                                        inputTokenInfo.market_data.atl.usd
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </li>
                          ) : null
                        }
                      </ul>
                      {
                        // @ts-ignore
                        topHolders?.inputHolders ? (
                          <div className="pt-4">
                            <div className="pb-3 m-1 text-base font-bold text-th-fgd-1">
                              top-ten
                            </div>
                            {
                              // @ts-ignore
                              topHolders.inputHolders.map((holder) => (
                                <a
                                  className="border-t border-th-bkg-4 default transition flex justify-between mx-1 px-2 py-2.5 text-th-fgd-3 hover:bg-th-bkg-2"
                                  href={`https://explorer.solana.com/address/${holder.owner}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={holder.owner}
                                >
                                  <div className="text-th-fgd-3">
                                    {holder.owner.slice(0, 5) +
                                      '…' +
                                      holder.owner.slice(-5)}
                                  </div>
                                  <div className="flex items-center">
                                    <div className="text-th-fgd-1">
                                      {numberFormatter.format(
                                        holder.amount /
                                          Math.pow(10, holder.decimals)
                                      )}
                                    </div>
                                    <ExternalLinkIcon className="w-4 h-4 ml-2" />
                                  </div>
                                </a>
                              ))
                            }
                          </div>
                        ) : null
                      }
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ) : (
          <div className="p-4 mt-3 text-center rounded-md bg-th-bkg-3 text-th-fgd-3"></div>
        )}

        {/*      {outputTokenInfo && quoteTokenId ? (*/}
        <div>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className={` DisclosureButton`}>
                  <ul>
                    <li>
                      {
                        // @ts-ignore
                        outputTokenInfo?.image?.small ? (
                          <img
                            // @ts-ignore
                            src={outputTokenInfo?.image?.small}
                            alt={outputTokenInfo?.name}
                          />
                        ) : null
                      }
                    </li>
                    <li className="selecttokenname">
                      {
                        // @ts-ignore
                        outputTokenInfo?.symbol?.toUpperCase()
                      }
                    </li>
                    <li>
                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data?.current_price?.usd ? (
                          <div className="selectnumber">
                            $
                            {numberFormatter.format(
                              // @ts-ignore
                              outputTokenInfo?.market_data.current_price.usd
                            )}
                          </div>
                        ) : null
                      }
                    </li>
                    <li>
                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data
                          ?.price_change_percentage_24h ? (
                          <div
                            id="selectnumber1"
                            className={`${
                              // @ts-ignore
                              outputTokenInfo.market_data
                                .price_change_percentage_24h >= 0
                                ? 'green'
                                : 'red'
                            }`}
                          >
                            {
                              // @ts-ignore
                              outputTokenInfo?.market_data.price_change_percentage_24h.toFixed(
                                2
                              )
                            }
                            %
                          </div>
                        ) : null
                      }
                    </li>
                  </ul>

                  <ChevronDownIcon
                    style={{ height: '30px' }}
                    className={`default-transition text-th-fgd-3 ${
                      open ? 'transform rotate-180' : 'transform rotate-360'
                    }`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  <div className="DisclosurePanel">
                    <div style={{ fontSize: '18px' }}>Market data</div>
                    <ul className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {
                        // @ts-ignore
                        outputTokenInfo?.market_cap_rank ? (
                          <li>
                            <div className="parent">
                              <span>market-cap-rank</span>
                              <span>
                                #
                                {
                                  // @ts-ignore
                                  outputTokenInfo?.market_cap_rank
                                }
                              </span>
                            </div>
                          </li>
                        ) : null
                      }

                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data?.market_cap && // @ts-ignore
                        outputTokenInfo?.market_data?.market_cap?.usd !== 0 ? (
                          <li>
                            <div className="parent">
                              <span>market-cap</span>
                              <span>
                                $
                                {numberCompacter.format(
                                  // @ts-ignore
                                  outputTokenInfo?.market_data?.market_cap?.usd
                                )}
                              </span>
                            </div>
                          </li>
                        ) : null
                      }

                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data?.total_volume?.usd ? (
                          <li>
                            <div className="parent">
                              <span>daily-volume</span>
                              <span>
                                $
                                {numberCompacter.format(
                                  // @ts-ignore
                                  outputTokenInfo?.market_data?.total_volume
                                    ?.usd
                                )}
                              </span>
                            </div>
                          </li>
                        ) : null
                      }

                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data?.circulating_supply ? (
                          <li>
                            <div className="parent">
                              <span>token-supply</span>
                              <span>
                                {numberCompacter.format(
                                  // @ts-ignore
                                  outputTokenInfo.market_data.circulating_supply
                                )}
                              </span>
                              {
                                // @ts-ignore
                                outputTokenInfo.market_data?.max_supply ? (
                                  <div
                                    style={{
                                      fontSize: '18px',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {' '}
                                    {numberCompacter.format(
                                      // @ts-ignore
                                      outputTokenInfo.market_data.max_supply
                                    )}
                                  </div>
                                ) : null
                              }
                            </div>
                          </li>
                        ) : null
                      }

                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data?.ath?.usd ? (
                          <li>
                            <div className="parent">
                              <span>ath</span>

                              <div className="difparent">
                                <div className="dif3">
                                  {
                                    // @ts-ignore
                                    outputTokenInfo.market_data?.ath_date
                                      ?.usd ? (
                                      <div>
                                        {dayjs(
                                          // @ts-ignore
                                          outputTokenInfo.market_data.ath_date
                                            .usd
                                        ).fromNow()}
                                      </div>
                                    ) : null
                                  }
                                </div>

                                <div className="dif2">
                                  {
                                    // @ts-ignore
                                    outputTokenInfo.market_data
                                      ?.ath_change_percentage?.usd ? (
                                      <div
                                        className={`ml-1.5 mt-1.5 text-xs ${
                                          // @ts-ignore
                                          outputTokenInfo.market_data
                                            ?.ath_change_percentage?.usd >= 0
                                            ? 'green'
                                            : 'red'
                                        }`}
                                      >
                                        {(outputTokenInfo?.market_data?.ath_change_percentage?.usd) // @ts-ignore
                                          .toFixed(2)}
                                        %
                                      </div>
                                    ) : null
                                  }
                                </div>
                                <div className="dif1">
                                  $
                                  {numberFormatter.format(
                                    // @ts-ignore
                                    outputTokenInfo?.market_data.ath.usd
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ) : null
                      }

                      {
                        // @ts-ignore
                        outputTokenInfo?.market_data?.atl?.usd ? (
                          <li>
                            <div className="parent">
                              <span>atl</span>

                              <div className="difparent">
                                <div className="dif3">
                                  {
                                    // @ts-ignore
                                    outputTokenInfo?.market_data?.atl_date
                                      ?.usd ? (
                                      <div>
                                        {dayjs(
                                          // @ts-ignore
                                          outputTokenInfo?.market_data.atl_date
                                            .usd
                                        ).fromNow()}
                                      </div>
                                    ) : null
                                  }
                                </div>

                                <div className="dif2">
                                  {
                                    // @ts-ignore
                                    outputTokenInfo?.market_data
                                      ?.atl_change_percentage?.usd ? (
                                      <div
                                        className={`ml-1.5 mt-1.5  ${
                                          // @ts-ignore
                                          outputTokenInfo.market_data
                                            ?.atl_change_percentage?.usd >= 0
                                            ? 'green'
                                            : 'red'
                                        }`}
                                      >
                                        {(outputTokenInfo?.market_data?.atl_change_percentage?.usd) // @ts-ignore
                                          .toLocaleString(undefined, {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                          })}
                                        %
                                      </div>
                                    ) : null
                                  }
                                </div>

                                <div className="dif1">
                                  $
                                  {numberFormatter.format(
                                    // @ts-ignore
                                    outputTokenInfo?.market_data.atl.usd
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ) : null
                      }
                    </ul>
                    {
                      // @ts-ignore
                      topHolders?.outputHolders ? (
                        <div className="pt-4">
                          <div className="pb-3 m-1 text-base font-bold text-th-fgd-1">
                            top-ten
                          </div>
                          {
                            // @ts-ignore
                            topHolders.outputHolders.map((holder) => (
                              <a
                                className="border-t border-th-bkg-4 default transition flex justify-between mx-1 px-2 py-2.5 text-th-fgd-3 hover:bg-th-bkg-2"
                                href={`https://explorer.solana.com/address/${holder.owner}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={holder.owner}
                              >
                                <div className="text-th-fgd-3">
                                  {holder.owner.slice(0, 5) +
                                    '…' +
                                    holder.owner.slice(-5)}
                                </div>
                                <div className="flex items-center">
                                  <div className="text-th-fgd-1">
                                    {numberFormatter.format(
                                      holder.amount /
                                        Math.pow(10, holder.decimals)
                                    )}
                                  </div>
                                  <ExternalLinkIcon className="w-4 h-4 ml-2" />
                                </div>
                              </a>
                            ))
                          }
                        </div>
                      ) : null
                    }
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </>
  )
}

export default SwapTokenInfo
