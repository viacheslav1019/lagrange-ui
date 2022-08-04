/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */

import {
  useEffect,
  useMemo,
  useState,
  FunctionComponent,
  useCallback,
  SetStateAction,
} from 'react'
import { useJupiter, RouteInfo } from '@jup-ag/react-hook'
import { TOKEN_LIST_URL } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'
import useMangoStore from '../stores/useMangoStore'
import {
  connectionSelector,
  walletConnectedSelector,
  walletSelector,
} from '../stores/selectors'

import { sortBy, sum } from 'lodash'
import { useTranslation } from 'next-i18next'
import {
  CogIcon,
  ExclamationCircleIcon,
  ExternalLinkIcon,
  InformationCircleIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { abbreviateAddress } from '../utils'
import { notify } from '../utils/notifications'
import SwapTokenSelect from './SwapTokenSelect'
import { Token } from '../@types/types'
import {
  getTokenAccountsByOwnerWithWrappedSol,
  nativeToUi,
  TokenAccount,
  zeroKey,
} from '@blockworks-foundation/mango-client'
import Button, { IconButton, LinkButton } from './Button'
import { useViewport } from '../hooks/useViewport'
import useLocalStorageState from '../hooks/useLocalStorageState'
import Modal from './Modal'
import { ElementTitle } from './styles'
import { RefreshClockwiseIcon, WalletIcon } from './icons'
import Tooltip from './Tooltip'
import SwapSettingsModal from './SwapSettingsModal'
import SwapTokenInfo from './SwapTokenInfo'
import { numberFormatter } from './SwapTokenInfo'

const TrustedTokenAddresses = [
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'A94X2fRy3wydNShU4dRaDyap2UuoeWJGWyATtyp61WZf', // BILIRA
  '5trVBqv1LvHxiSPMsHtEZuf8iN82wbpDcR5Zaw7sWC3s', // soJPYC
  'FtgGSFADXBtroxq8VCausXRr2of47QBf5AS1NtZCu4GD', // BRZ
  'CbNYA9n3927uXUukee2Hf4tm3xxkffJPPZvGazc2EAH1', // agEUR
  '3uXMgtaMRBcyEtEChgiLMdHDjb5Azr17SQWwQo3ppEH8', // Wrapped BRZ
  // 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac', // mango
]

type UseJupiterProps = Parameters<typeof useJupiter>[0]

const JupiterForm: FunctionComponent = () => {
  const { t } = useTranslation(['common', 'swap'])
  const wallet = useMangoStore(walletSelector)
  const connection = useMangoStore(connectionSelector)
  const connected = useMangoStore(walletConnectedSelector)

  const [showSettings, setShowSettings] = useState(false)
  const [depositAndFee, setDepositAndFee] = useState(null as any)

  const [selectedRoute, setSelectedRoute] = useState<RouteInfo>(null as any)
  const [showInputTokenSelect, setShowInputTokenSelect] = useState(false)
  const [showOutputTokenSelect, setShowOutputTokenSelect] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])
  const [tokenPrices, setTokenPrices] = useState(null)
  const [coinGeckoList, setCoinGeckoList] = useState(null as any)
  const [walletTokens, setWalletTokens] = useState([])
  const [slippage, setSlippage] = useState(0.5)
  const [formValue, setFormValue] = useState<UseJupiterProps>({
    amount: null as any,
    inputMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    outputMint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
    slippage,
  })
  const [hasSwapped, setHasSwapped] = useLocalStorageState('hasSwapped', false)
  const [showWalletDraw, setShowWalletDraw] = useState(false)
  const [walletTokenPrices, setWalletTokenPrices] = useState(null)
  const { width } = useViewport()
  const [feeValue, setFeeValue] = useState(null as any)
  const [showRoutesModal, setShowRoutesModal] = useState(false)
  const [loadWalletTokens, setLoadWalletTokens] = useState(false)
  const [swapRate, setSwapRate] = useState(false)
  const [activeTab, setActiveTab] = useState('Market Data')

  const handleTabChange = (tabName: SetStateAction<string>) => {
    setActiveTab(tabName)
  }

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

  const [inputTokenInfo, outputTokenInfo] = useMemo(() => {
    return [
      tokens.find(
        (item) => item?.address === formValue.inputMint?.toBase58() || ''
      ),
      tokens.find(
        (item) => item?.address === formValue.outputMint?.toBase58() || ''
      ),
    ]
  }, [
    formValue.inputMint?.toBase58(),
    formValue.outputMint?.toBase58(),
    tokens,
  ])

  useEffect(() => {
    if (width >= 1680) {
      setShowWalletDraw(true)
    }
  }, [])

  useEffect(() => {
    const fetchCoinGeckoList = async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/list'
      )
      const data = await response.json()
      setCoinGeckoList(data)
    }

    fetchCoinGeckoList()
  }, [])

  useEffect(() => {
    if (connected) {
      fetchWalletTokens()
    }
  }, [connected])

  useEffect(() => {
    if (!coinGeckoList?.length) return
    setTokenPrices(null)
    const fetchTokenPrices = async () => {
      const inputId = coinGeckoList.find((x: { id: any; symbol: string }) =>
        inputTokenInfos?.extensions?.coingeckoId
          ? x?.id === inputTokenInfos.extensions.coingeckoId
          : x?.symbol?.toLowerCase() === inputTokenInfo?.symbol?.toLowerCase()
      )?.id

      const outputId = coinGeckoList.find((x: { id: any; symbol: string }) =>
        outputTokenInfos?.extensions?.coingeckoId
          ? x?.id === outputTokenInfos.extensions.coingeckoId
          : x?.symbol?.toLowerCase() === outputTokenInfo?.symbol?.toLowerCase()
      )?.id

      if (inputId && outputId) {
        const results = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${inputId},${outputId}&vs_currencies=usd`
        )
        const json = await results.json()
        if (json[inputId]?.usd && json[outputId]?.usd) {
          setTokenPrices({
            // @ts-ignore
            inputTokenPrice: json[inputId].usd,
            outputTokenPrice: json[outputId].usd,
          })
        }
      }
    }

    if (inputTokenInfo && outputTokenInfo) {
      fetchTokenPrices()
    }
  }, [inputTokenInfo, outputTokenInfo, coinGeckoList])

  const amountInDecimal = useMemo(() => {
    return formValue.amount * 10 ** (inputTokenInfo?.decimals || 1)
  }, [inputTokenInfo, formValue.amount])

  const { routeMap, allTokenMints, routes, loading, exchange, error, refresh } =
    useJupiter({
      ...formValue,
      amount: amountInDecimal,
      slippage,
    })

  useEffect(() => {
    // Fetch token list from Jupiter API
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then((response) => response.json())
      .then((result) => {
        const tokens = allTokenMints
          .filter((item) => TrustedTokenAddresses.includes(item))
          .map((mint) =>
            result.find((item: { address: string }) => item?.address === mint)
          )
        setTokens(tokens)
      })
  }, [allTokenMints])

  useEffect(() => {
    if (routes) {
      setSelectedRoute(routes[0])
    }
  }, [routes])

  useEffect(() => {
    const getDepositAndFee = async () => {
      const fees: SetStateAction<any> | undefined =
        await selectedRoute.getDepositAndFee()

      setDepositAndFee(fees)
    }
    if (selectedRoute && connected) {
      getDepositAndFee()
    }
  }, [selectedRoute])

  const outputTokenMints = useMemo(() => {
    if (routeMap.size && formValue.inputMint) {
      const routeOptions: any = routeMap.get(formValue.inputMint.toString())

      const routeOptionTokens = routeOptions.map((address: string) => {
        return tokens.find((t) => {
          return t?.address === address
        })
      })

      return routeOptionTokens
    } else {
      return sortedTokenMints
    }
  }, [routeMap, tokens, formValue.inputMint])

  const inputWalletBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return t.account.mint.toString() === inputTokenInfo?.address
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }

    return 0.0
  }

  const outputWalletBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        // @ts-ignore
        return t.account.mint.toString() === outputTokenInfo?.address
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      // @ts-ignore
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const [walletTokensWithInfos] = useMemo(() => {
    const userTokens: any[] = []
    tokens.map((item) => {
      const found = walletTokens.find(
        // @ts-ignore
        (token) => token.account.mint.toBase58() === item?.address
      )
      if (found) {
        // @ts-ignore
        userTokens.push({ ...found, item })
      }
    })
    return [userTokens]
  }, [walletTokens, tokens])

  const getWalletTokenPrices = async () => {
    const ids = walletTokensWithInfos.map(
      (token) => token.item.extensions?.coingeckoId
    )
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.toString()}&vs_currencies=usd`
    )
    const data = await response.json()
    setWalletTokenPrices(data)
  }

  const refreshWallet = async () => {
    setLoadWalletTokens(true)
    await fetchWalletTokens()
    await getWalletTokenPrices()
    setLoadWalletTokens(false)
  }

  const getSwapFeeTokenValue = async () => {
    const mints = selectedRoute.marketInfos.map((info) => info.lpFee.mint)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mints.toString()}&vs_currencies=usd`
    )
    const data = await response.json()

    const feeValue = selectedRoute.marketInfos.reduce((a: any, c) => {
      const feeToken: any = tokens.find(
        (item) => item?.address === c.lpFee?.mint
      )

      const amount = c.lpFee?.amount / Math.pow(10, feeToken?.decimals)
      if (data[c.lpFee?.mint]) {
        return a + data[c.lpFee?.mint].usd * amount
      }
      if (c.lpFee?.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') {
        return a + 1 * amount
      }
    }, 0)

    setFeeValue(feeValue)
  }

  useEffect(() => {
    if (selectedRoute) {
      getSwapFeeTokenValue()
    }
  }, [selectedRoute])

  useEffect(() => {
    getWalletTokenPrices()
  }, [walletTokensWithInfos])

  const handleSelectRoute = (route: SetStateAction<RouteInfo>) => {
    setShowRoutesModal(false)
    setSelectedRoute(route)
  }

  const handleSwitchMints = () => {
    setFormValue((val) => ({
      ...val,
      inputMint: formValue.outputMint,
      outputMint: formValue.inputMint,
    }))
  }

  const sortedTokenMints = sortBy(tokens, (token) => {
    return token?.symbol?.toLowerCase()
  })

  const outAmountUi: any = selectedRoute
    ? selectedRoute.outAmount / 10 ** (outputTokenInfo?.decimals || 1)
    : null

  const swapDisabled = loading || !selectedRoute || routes?.length === 0

  const inputTokenInfos = inputTokenInfo ? (inputTokenInfo as any) : null
  const outputTokenInfos = outputTokenInfo ? (outputTokenInfo as any) : null

  return (
    <div className="Swap">
      <div className="contents">
        <div className="swapcontent">
          <div className="paydiv">
            <label htmlFor="inputMint">Pay</label>
            <label htmlFor="amount">
              <span style={{ fontWeight: '400' }}>Balance</span>{' '}
              {inputWalletBalance()}
            </label>
          </div>

          <figure>
            <input
              name="amount"
              id="amount"
              value={formValue.amount || ''}
              placeholder="0.00"
              type="number"
              autoComplete="off"
              onInput={(e: any) => {
                let newValue = e.target?.value || 0
                newValue = Number.isNaN(newValue) ? 0 : newValue

                setFormValue((val) => ({
                  ...val,
                  amount: newValue,
                }))
              }}
            />

            <button onClick={() => setShowInputTokenSelect(true)}>
              {inputTokenInfo?.logoURI ? (
                <img
                  src={inputTokenInfo?.logoURI}
                  alt={inputTokenInfo?.symbol}
                />
              ) : null}

              <span>{inputTokenInfo?.symbol}</span>

              <ChevronDownIcon className="icon" />
            </button>
          </figure>

          <div className="switchdiv">
            <div className="line"></div>
            <button onClick={handleSwitchMints}>
              <i className="fa-solid fa-repeat icon"></i>
            </button>
          </div>

          <div className="paydiv">
            <label htmlFor="outputMint">Receive</label>
            <label htmlFor="amount">
              <span style={{ fontWeight: '400' }}>Balance</span>{' '}
              {outputWalletBalance()}
            </label>
          </div>

          <figure>
            <input
              name="amount"
              id="amount"
              disabled
              placeholder="0.00"
              value={
                selectedRoute?.outAmount && formValue.amount
                  ? Intl.NumberFormat('en', {
                      minimumSignificantDigits: 1,
                      maximumSignificantDigits: 6,
                    }).format(
                      selectedRoute?.outAmount /
                        10 ** (outputTokenInfo?.decimals || 1)
                    )
                  : ''
              }
            />

            <button onClick={() => setShowOutputTokenSelect(true)}>
              {outputTokenInfo?.logoURI ? (
                <img
                  src={outputTokenInfo?.logoURI}
                  alt={outputTokenInfo?.symbol}
                />
              ) : null}

              <span> {outputTokenInfo?.symbol} </span>

              <ChevronDownIcon className="icon" />
            </button>
          </figure>

          {selectedRoute?.outAmount &&
          formValue.amount &&
          // @ts-ignore
          tokenPrices?.outputTokenPrice ? (
            <div className="absolute left-0 mt-1  info info1">
              ≈ $
              {(
                (selectedRoute?.outAmount /
                  10 ** (outputTokenInfo?.decimals || 1)) *
                // @ts-ignore
                tokenPrices?.outputTokenPrice
              ).toFixed(2)}
            </div>
          ) : null}

          {routes?.length && selectedRoute ? (
            <div className="info info2">
              <div>
                <div className="flex">
                  <span style={{ marginRight: '5px' }}>price-impact: </span>
                  <div className="text-left">
                    {selectedRoute?.priceImpactPct * 100 < 0.1
                      ? '< 0.1%'
                      : `~ ${(selectedRoute?.priceImpactPct * 100).toFixed(
                          4
                        )}%`}
                  </div>
                </div>
                <div className="flex">
                  <span style={{ marginRight: '5px' }}>
                    swap:minimum-received:{' '}
                  </span>
                  <div className="text-right text-th-fgd-1">
                    {numberFormatter.format(
                      selectedRoute?.outAmountWithSlippage /
                        // @ts-ignore
                        10 ** outputTokenInfo?.decimals || 1
                    )}{' '}
                    {outputTokenInfo?.symbol}
                  </div>
                </div>
                {!isNaN(feeValue) ? (
                  <div className="flex">
                    <span style={{ marginRight: '5px' }}>swap-fee: </span>
                    <div className="flex items-center">
                      <div className="text-right text-th-fgd-1">
                        ≈ ${feeValue?.toFixed(2)}
                      </div>
                      <Tooltip
                        content={
                          <div className="space-y-2.5">
                            {selectedRoute?.marketInfos.map((info, index) => {
                              const feeToken: any = tokens.find(
                                (item) => item?.address === info.lpFee?.mint
                              )
                              return (
                                <div key={index}>
                                  <span></span>
                                  <div className="text-th-fgd-1">
                                    {(
                                      info.lpFee?.amount /
                                      Math.pow(10, feeToken?.decimals)
                                    ).toFixed(6)}{' '}
                                    {feeToken?.symbol} ({info.lpFee?.pct * 100}
                                    %)
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        }
                        placement={'left'}
                      >
                        <InformationCircleIcon className="cursor-help h-3.5 ml-1.5 w-3.5 text-th-primary" />
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  selectedRoute?.marketInfos.map((info, index) => {
                    const feeToken: any = tokens.find(
                      (item) => item?.address === info.lpFee?.mint
                    )
                    return (
                      <div className="flex" key={index}>
                        <span style={{ marginRight: '5px' }}>
                          {t('swap:fees-paid-to:', {
                            feeRecipient: info.marketMeta?.amm?.label,
                          })}
                          :
                        </span>
                        <div className="text-right text-th-fgd-1">
                          {(
                            info.lpFee?.amount /
                            Math.pow(10, feeToken?.decimals)
                          ).toFixed(6)}{' '}
                          {feeToken?.symbol} ({info.lpFee?.pct * 100}%)
                        </div>
                      </div>
                    )
                  })
                )}
                {connected ? (
                  <>
                    <div className="flex justify-between">
                      <span>transaction-fee</span>
                      <div className="text-right text-th-fgd-1">
                        {depositAndFee
                          ? depositAndFee?.signatureFee / Math.pow(10, 9)
                          : '-'}{' '}
                        SOL
                      </div>
                    </div>

                    {depositAndFee?.ataDepositLength ||
                    depositAndFee?.openOrdersDeposits?.length ? (
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span>deposit</span>
                          <Tooltip
                            content={
                              <>
                                {depositAndFee?.ataDepositLength ? (
                                  <div>need-ata-account</div>
                                ) : null}

                                {depositAndFee?.openOrdersDeposits?.length ? (
                                  <div className="mt-2">
                                    serum-requires-openorders
                                    <a
                                      href="https://docs.google.com/document/d/1qEWc_Bmc1aAxyCUcilKB4ZYpOu3B0BxIbe__dRYmVns/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      heres-how
                                    </a>
                                  </div>
                                ) : null}
                              </>
                            }
                            placement={'left'}
                          >
                            <InformationCircleIcon className="cursor-help h-3.5 ml-1.5 w-3.5 text-th-primary" />
                          </Tooltip>
                        </div>
                        <div>
                          {depositAndFee?.ataDepositLength ? (
                            <div className="text-right text-th-fgd-1">
                              {depositAndFee?.ataDepositLength === 1
                                ? t('swap:ata-deposit-details', {
                                    cost: (
                                      depositAndFee?.ataDeposit /
                                      Math.pow(10, 9)
                                    ).toFixed(5),
                                    count: depositAndFee?.ataDepositLength,
                                  })
                                : t('swap:ata-deposit-details_plural', {
                                    cost: (
                                      depositAndFee?.ataDeposit /
                                      Math.pow(10, 9)
                                    ).toFixed(5),
                                    count: depositAndFee?.ataDepositLength,
                                  })}
                            </div>
                          ) : null}
                          {depositAndFee?.openOrdersDeposits?.length ? (
                            <div className="text-right text-th-fgd-1">
                              {depositAndFee?.openOrdersDeposits.length > 1
                                ? t('swap:serum-details_plural', {
                                    cost: (
                                      sum(depositAndFee?.openOrdersDeposits) /
                                      Math.pow(10, 9)
                                    ).toFixed(5),
                                    count:
                                      depositAndFee?.openOrdersDeposits.length,
                                  })
                                : t('swap:serum-details', {
                                    cost: (
                                      sum(depositAndFee?.openOrdersDeposits) /
                                      Math.pow(10, 9)
                                    ).toFixed(5),
                                    count:
                                      depositAndFee?.openOrdersDeposits.length,
                                  })}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
          {routes?.length && selectedRoute ? (
            <div className="line1"> </div>
          ) : null}
          {error && (
            <div className="flex items-center justify-center mt-2 text-th-red">
              <ExclamationCircleIcon className="h-5 mr-1.5 w-5" />
              jupiter-error
            </div>
          )}
          <Button
            className="connectswap"
            disabled={swapDisabled}
            onClick={async () => {
              if (!connected && zeroKey !== wallet?.publicKey) {
                wallet.connect()
              } else if (!loading && selectedRoute && connected) {
                setSwapping(true)
                let txCount = 1
                let errorTxid
                const swapResult = await exchange({
                  wallet: wallet as any,
                  // @ts-ignore
                  route: selectedRoute,
                  confirmationWaiterFactory: async (txid, totalTxs) => {
                    console.log('txid, totalTxs', txid, totalTxs)
                    if (txCount === totalTxs) {
                      errorTxid = txid

                      notify({
                        type: 'confirm',
                        title: 'Confirming Transaction',
                        txid,
                      })
                    }
                    await connection.confirmTransaction(txid, 'confirmed')

                    txCount++
                    return await connection.getTransaction(txid, {
                      commitment: 'confirmed',
                    })
                  },
                })
                console.log('swapResult', swapResult)

                setSwapping(false)
                fetchWalletTokens()
                inputWalletBalance()
                outputWalletBalance()
                //bura
                if ('error' in swapResult) {
                  console.log('Error:', swapResult.error)
                  // @ts-ignore
                  notify({
                    type: 'error',
                    // @ts-ignore
                    title: swapResult.error.name,
                    // @ts-ignore
                    description: swapResult.error.message,
                    txid: errorTxid,
                  })
                } else if ('txid' in swapResult) {
                  // @ts-ignore
                  notify({
                    type: 'success',
                    title: 'Swap Successful',
                    description: `Swapped ${
                      // @ts-ignore
                      swapResult.inputAmount /
                      10 ** (inputTokenInfo?.decimals || 1)
                    } ${inputTokenInfo?.symbol} to ${
                      // @ts-ignore
                      swapResult.outputAmount /
                      10 ** (outputTokenInfo?.decimals || 1)
                    } ${outputTokenInfo?.symbol}`,
                    txid: swapResult.txid,
                  })
                  // @ts-ignore
                  setFormValue((val) => ({
                    ...val,
                    amount: null,
                  }))
                }
              }
            }}
          >
            {connected ? (swapping ? 'Swapping...' : 'Swap') : 'Connect Wallet'}
          </Button>
        </div>

        {showRoutesModal ? (
          <Modal
            isOpen={showRoutesModal}
            onClose={() => setShowRoutesModal(false)}
          >
            <div className="mb-4 text-lg font-bold text-center text-th-fgd-1">
              {t('swap:routes-found', {
                numberOfRoutes: routes?.length,
              })}
            </div>
            <div className="pr-1 overflow-x-hidden overflow-y-auto max-h-96 thin-scroll">
              {routes.map((route, index) => {
                const selected = selectedRoute === route
                return (
                  <div
                    key={index}
                    className={`bg-th-bkg-3 border default-transition rounded mb-2 hover:bg-th-bkg-4 ${
                      selected
                        ? 'border-th-primary text-th-primary hover:border-th-primary'
                        : 'border-transparent text-th-fgd-1'
                    }`}
                  >
                    <button
                      className="w-full p-4"
                      onClick={() => handleSelectRoute(route)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col text-left">
                          <div className="whitespace-nowrap overflow-ellipsis">
                            {route.marketInfos.map((info, index) => {
                              let includeSeparator = false
                              if (
                                route.marketInfos.length > 1 &&
                                index !== route.marketInfos.length - 1
                              ) {
                                includeSeparator = true
                              }
                              return (
                                <span key={index}>{`${
                                  info.marketMeta.amm.label
                                } ${includeSeparator ? 'x ' : ''}`}</span>
                              )
                            })}
                          </div>
                          <div className="text-xs font-normal text-th-fgd-4">
                            {inputTokenInfo?.symbol} →{' '}
                            {route.marketInfos.map((r, index) => {
                              const showArrow =
                                index !== route.marketInfos.length - 1
                                  ? true
                                  : false
                              return (
                                <span key={index}>
                                  <span>
                                    {
                                      tokens.find(
                                        (item) =>
                                          item?.address ===
                                          r?.outputMint?.toString()
                                      )?.symbol
                                    }
                                  </span>
                                  {showArrow ? ' → ' : ''}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                        <div className="text-lg">
                          {numberFormatter.format(
                            route.outAmount /
                              10 ** (outputTokenInfo?.decimals || 1)
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </Modal>
        ) : null}
        {showInputTokenSelect ? (
          <SwapTokenSelect
            isOpen={showInputTokenSelect}
            onClose={() => setShowInputTokenSelect(false)}
            sortedTokenMints={sortedTokenMints}
            onTokenSelect={(token) => {
              setShowInputTokenSelect(false)
              setFormValue((val) => ({
                ...val,
                inputMint: new PublicKey(token?.address),
              }))
            }}
          />
        ) : null}
        {showOutputTokenSelect ? (
          <SwapTokenSelect
            isOpen={showOutputTokenSelect}
            onClose={() => setShowOutputTokenSelect(false)}
            sortedTokenMints={outputTokenMints}
            onTokenSelect={(token) => {
              setShowOutputTokenSelect(false)
              setFormValue((val) => ({
                ...val,
                outputMint: new PublicKey(token?.address),
              }))
            }}
          />
        ) : null}
        {showSettings ? (
          <SwapSettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            slippage={slippage}
            setSlippage={setSlippage}
          />
        ) : null}
        {/*  {connected && !hasSwapped ? (
                <Modal isOpen={!hasSwapped} onClose={() => setHasSwapped(true)}>
                  <ElementTitle>get-started</ElementTitle>
                  <div className="flex flex-col justify-center">
                    <div className="text-center text-th-fgd-3">
                      swap-in-wallet
                    </div>
                  </div>
                </Modal>
              ) : null}  */}
        {showInputTokenSelect ? (
          <SwapTokenSelect
            isOpen={showInputTokenSelect}
            onClose={() => setShowInputTokenSelect(false)}
            sortedTokenMints={sortedTokenMints}
            onTokenSelect={(token) => {
              setShowInputTokenSelect(false)
              setFormValue((val) => ({
                ...val,
                inputMint: new PublicKey(token?.address),
              }))
            }}
          />
        ) : null}
        {showOutputTokenSelect ? (
          <SwapTokenSelect
            isOpen={showOutputTokenSelect}
            onClose={() => setShowOutputTokenSelect(false)}
            sortedTokenMints={outputTokenMints}
            onTokenSelect={(token) => {
              setShowOutputTokenSelect(false)
              setFormValue((val) => ({
                ...val,
                outputMint: new PublicKey(token?.address),
              }))
            }}
          />
        ) : null}

        <div className="SwapTokenInfo">
          <SwapTokenInfo
            inputTokenId={inputTokenInfos?.extensions?.coingeckoId}
            outputTokenId={outputTokenInfos?.extensions?.coingeckoId}
          />
        </div>
      </div>
    </div>
  )
}

export default JupiterForm
