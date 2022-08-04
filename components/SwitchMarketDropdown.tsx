import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Popover, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import Input from './Input'
import { useTranslation } from 'next-i18next'
import MarketNavItem from './MarketNavItem'
import useMangoStore from '../stores/useMangoStore'
import Router from 'next/router'
import { MARKETS } from '@project-serum/serum';

export const stableCoinsList = ['USDT']

const SwitchMarketDropdown = () => {
  const groupConfig = useMangoStore((s) => s.selectedMangoGroup.config)
  const marketConfig = useMangoStore((s) => s.selectedMarket.config)
  const baseSymbol = marketConfig.baseSymbol
  const isPerpMarket = marketConfig.kind === 'perp'
  const trybMarket = MARKETS.find(market => market.name === "TRYB/USDT");
  useEffect(() => {
    if (isPerpMarket) {
      Router.push('/pro/trade?name=USDT/USDC')
    }
  }, [])

  const marketsInfo = useMangoStore((s) =>
    s.marketsInfo.filter((mkt) => {
      let result = false
      stableCoinsList.map((coin) => {
        if (mkt?.name.includes(coin)) {
          result = true
        }
      })
      return result
    })
  )

  // const perpMarketsInfo = useMemo(
  //   () =>
  //     marketsInfo
  //       .filter((mkt) => mkt?.name.includes('PERP'))
  //       .sort((a, b) => b.volumeUsd24h - a.volumeUsd24h),
  //   [marketsInfo]
  // )

  const spotMarketsInfo = useMemo(
    () =>
      [...marketsInfo
        .filter(
          (mkt) => mkt?.name.includes('USDC') || mkt?.name.includes('USDT')
        )
        .sort((a, b) => b.volumeUsd24h - a.volumeUsd24h), trybMarket],
    [marketsInfo]
  )

  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searchString, setSearchString] = useState('')
  const buttonRef = useRef(null)
  const { t } = useTranslation('common')
  const filteredMarkets = marketsInfo
    .filter((mkt) => mkt?.name.includes('USDC'))
    .filter((m) => m.name.toLowerCase().includes(searchString.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const onSearch = (searchString) => {
    if (searchString.length > 0) {
      const newSuggestions = suggestions.filter((v) =>
        v.name?.toLowerCase().includes(searchString.toLowerCase())
      )
      setSuggestions(newSuggestions)
    }
    setSearchString(searchString)
  }

  const callbackRef = useCallback((inputElement) => {
    if (inputElement) {
      const timer = setTimeout(() => inputElement.focus(), 200)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <Popover>
      {({ open }) => (
        <div className="relative flex flex-col">
          <Popover.Button
            className={`switch-dropdown-popup border rounded-md border-[#fafafa] p-0.5 transition-none hover:border-[#787878] focus:border-[#787878] focus:outline-none ${
              open && 'border-[#787878]'
            }`}
            ref={buttonRef}
          >
            <div className="flex items-center pl-2">
              <img
                alt=""
                width="24"
                height="24"
                src={`/assets/icons/${baseSymbol?.toLowerCase()}.svg`}
                className={`mr-2.5`}
              />

              <div className="pr-0.5 text-xl font-semibold">{baseSymbol}</div>
              <span className="text-xl text-th-fgd-4">
                {isPerpMarket ? '-' : '/'}
              </span>
              <div className="pl-0.5 text-xl font-semibold">
                {isPerpMarket ? 'PERP' : groupConfig?.quoteSymbol}
              </div>
              <div
                className={`flex h-10 w-8 items-center justify-center rounded-none`}
              >
                <ChevronDownIcon
                  className={`default-transition h-6 w-6 ${
                    open ? 'rotate-180 transform' : 'rotate-360 transform'
                  }`}
                />
              </div>
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition-all ease-in duration-200"
            enterFrom="opacity-0 transform scale-75"
            enterTo="opacity-100 transform scale-100"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel
              className="switch-dropdown-popup thin-scroll absolute left-0 top-14 z-10 max-h-[50vh] w-72 transform overflow-y-auto rounded-b-md rounded-tl-md bg-[#fafafa] p-4 sm:max-h-[75vh]"
              tabIndex={-1}
            >
              <div className="hidden pb-2.5 sm:block">
                <Input
                  onChange={(e) => onSearch(e.target.value)}
                  prefix={<SearchIcon className="h-4 w-4 text-th-fgd-3" />}
                  ref={callbackRef}
                  type="text"
                  value={searchString}
                />
              </div>
              {searchString.length > 0 ? (
                <div className="pt-1.5">
                  {filteredMarkets.length > 0 ? (
                    filteredMarkets.map((mkt) => (
                      <MarketNavItem
                        buttonRef={buttonRef}
                        onClick={() => setSearchString('')}
                        market={mkt}
                        key={mkt.name}
                      />
                    ))
                  ) : (
                    <p className="mb-0 text-center">{t('no-markets')}</p>
                  )}
                </div>
              ) : (
                <div className="">
                  {/* <div className="flex justify-between py-1.5">
                    <h4 className="text-xs font-normal">{t('futures')}</h4>
                    <p className="mb-0 hidden text-xs text-th-fgd-3 sm:block">
                      {t('favorite')}
                    </p>
                  </div> */}
                  {/* {perpMarketsInfo.map((mkt) => (
                    <MarketNavItem
                      buttonRef={buttonRef}
                      onClick={() => setSearchString('')}
                      market={mkt}
                      key={mkt.name}
                    />
                  ))} */}
                  <div className="flex justify-between py-1.5">
                    <h4 className="text-xs font-normal">{t('spot')}</h4>
                    <p className="mb-0 hidden text-xs text-th-fgd-3 sm:block">
                      {t('favorite')}
                    </p>
                  </div>
                  {spotMarketsInfo.map((mkt) => (
                    <MarketNavItem
                      buttonRef={buttonRef}
                      onClick={() => setSearchString('')}
                      market={mkt}
                      key={mkt.name}
                    />
                  ))}
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  )
}

export default SwitchMarketDropdown
