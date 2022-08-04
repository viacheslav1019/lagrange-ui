/* eslint-disable @typescript-eslint/no-unused-vars */
import dynamic from 'next/dynamic'
import { Responsive, WidthProvider } from 'react-grid-layout'
import round from 'lodash/round'
import max from 'lodash/max'
import MobileTradePage from './mobile/MobileTradePage'

const TVChartContainer = dynamic(
  () => import('../components/TradingView'),
  { ssr: false }
)

const SerumTVChartContainer = dynamic(
  () => import('../components/TradingView/SerumTradingView'),
  { ssr: false }
)
import { useEffect, useState } from 'react'
import FloatingElement from '../components/FloatingElement'
import Orderbook from '../components/Orderbook'
import AccountInfo from './AccountInfo'
import Footer from './Footer'
import UserMarketInfo from './UserMarketInfo'
import TradeForm from './trade_form/TradeForm'
import UserInfo from './UserInfo'
import RecentMarketTrades from './RecentMarketTrades'
//@ts-ignore
import useMangoStore from '../stores/useMangoStore'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { useViewport } from '../hooks/useViewport'
import MarketDetails from './MarketDetails'

const ResponsiveGridLayout = WidthProvider(Responsive)

export const defaultLayouts = {
  xl: [
    { i: 'tvChart', x: 0, y: 0, w: 6, h: 27 },
    { i: 'marketPosition', x: 9, y: 4, w: 3, h: 13 },
    { i: 'accountInfo', x: 9, y: 3, w: 3, h: 14 },
    { i: 'orderbook', x: 6, y: 0, w: 3, h: 17 },
    { i: 'tradeForm', x: 9, y: 1, w: 3, h: 17 },
    { i: 'marketTrades', x: 6, y: 1, w: 3, h: 10 },
    { i: 'userInfo', x: 0, y: 2, w: 9, h: 19 },
  ],
  lg: [
    { i: 'tvChart', x: 0, y: 0, w: 6, h: 27, minW: 2 },
    { i: 'marketPosition', x: 9, y: 2, w: 3, h: 13, minW: 2 },
    { i: 'accountInfo', x: 9, y: 1, w: 3, h: 14, minW: 2 },
    { i: 'orderbook', x: 6, y: 2, w: 3, h: 17, minW: 2 },
    { i: 'tradeForm', x: 9, y: 0, w: 3, h: 17, minW: 3 },
    { i: 'marketTrades', x: 6, y: 2, w: 3, h: 10, minW: 2 },
    { i: 'userInfo', x: 0, y: 3, w: 9, h: 19, minW: 6 },
  ],
  md: [
    { i: 'tvChart', x: 0, y: 0, w: 8, h: 25, minW: 2 },
    { i: 'marketPosition', x: 8, y: 1, w: 4, h: 11, minW: 2 },
    { i: 'accountInfo', x: 8, y: 0, w: 4, h: 14, minW: 2 },
    { i: 'orderbook', x: 0, y: 2, w: 4, h: 19, minW: 2 },
    { i: 'tradeForm', x: 4, y: 2, w: 4, h: 19, minW: 3 },
    { i: 'marketTrades', x: 8, y: 2, w: 4, h: 19, minW: 2 },
    { i: 'userInfo', x: 0, y: 3, w: 12, h: 19, minW: 6 },
  ],
  sm: [
    { i: 'tvChart', x: 0, y: 0, w: 12, h: 20, minW: 6 },
    { i: 'marketPosition', x: 0, y: 1, w: 6, h: 14, minW: 6 },
    { i: 'accountInfo', x: 6, y: 1, w: 6, h: 14, minW: 6 },
    { i: 'tradeForm', x: 0, y: 2, w: 12, h: 17, minW: 6 },
    { i: 'orderbook', x: 0, y: 3, w: 6, h: 17, minW: 6 },
    { i: 'marketTrades', x: 6, y: 3, w: 6, h: 17, minW: 6 },
    { i: 'userInfo', x: 0, y: 4, w: 12, h: 19, minW: 6 },
  ],
}

export const GRID_LAYOUT_KEY = 'mangoSavedLayouts-3.1.6'
export const breakpoints = { xl: 1600, lg: 1280, md: 1024, sm: 100 }

const getCurrentBreakpoint = () => {
  return Responsive.utils.getBreakpointFromWidth(
    breakpoints,
    window.innerWidth - 63
  )
}

const TradePageGrid: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const { uiLocked } = useMangoStore((s) => s.settings)
  const [savedLayouts, setSavedLayouts] = useLocalStorageState(
    GRID_LAYOUT_KEY,
    defaultLayouts
  )
  const { width } = useViewport()
  const isMobile = width ? width < breakpoints.sm : false

  const onLayoutChange = (layouts) => {
    if (layouts) {
      setSavedLayouts(layouts)
    }
  }

  const [orderbookDepth, setOrderbookDepth] = useState(10)
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string | null>(
    null
  )

  const onBreakpointChange = (newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint)
  }

  useEffect(() => {
    const adjustOrderBook = (layouts, breakpoint?: string | null) => {
      const bp = breakpoint ? breakpoint : getCurrentBreakpoint()
      const orderbookLayout = layouts[bp].find((obj) => {
        return obj.i === 'orderbook'
      })
      let depth = orderbookLayout.h * 0.891 - 5
      const maxNum = max([1, depth])
      if (typeof maxNum === 'number') {
        depth = round(maxNum)
      }
      setOrderbookDepth(depth)
    }

    adjustOrderBook(savedLayouts, currentBreakpoint)
  }, [currentBreakpoint, savedLayouts])

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return !isMobile ? (
    <>
      <div className="pt-2">
        <MarketDetails />
      </div>
      <div className="responsive-design-grid-layout">
        <div className="grid xl:grid-cols-2 grid-cols-1 w-full gap-5">
          <div className="tvChart h-full">
            <FloatingElement className="chart1 w-full h-3/4 min-h-[500px]">
              <TVChartContainer />
            </FloatingElement>
          </div>
          <div>
            <div className="grid xl:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-5">
              <div className="order-book-div" key="orderbook">
                <Orderbook depth={orderbookDepth} />
              </div>
              <div className="trade-form-div" key="tradeForm">
                <TradeForm />
              </div>
              <div key="marketTrades">
                <FloatingElement className="recent-trade-div">
                  <RecentMarketTrades />
                </FloatingElement>
              </div>
            </div>
          </div>
        </div>
        {/* <FloatingElement className="account-info" showConnect>
          <AccountInfo />
        </FloatingElement>
        <div key="marketPosition">
          <FloatingElement className="usdt-usdc-position-div" showConnect>
            <UserMarketInfo />
          </FloatingElement>
        </div>
        <div key="userInfo">
          <FloatingElement className="balances-orders-fixed">
            <UserInfo />
          </FloatingElement>
        </div> */}
        <Footer />
      </div>
    </>
  ) : (
    <MobileTradePage />
  )
}

export default TradePageGrid
