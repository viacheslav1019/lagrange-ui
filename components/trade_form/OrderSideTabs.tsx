import { FunctionComponent } from 'react'
import { PerpMarket } from '@blockworks-foundation/mango-client'
import useMangoStore from '../../stores/useMangoStore'
import { useTranslation } from 'next-i18next'
import { capitalize } from '../../utils'

interface OrderSideTabsProps {
  isSimpleForm?: boolean
  onChange: (x) => void
  side: string
}

const OrderSideTabs: FunctionComponent<OrderSideTabsProps> = ({
  isSimpleForm,
  onChange,
  side,
}) => {
  const { t } = useTranslation('common')
  const market = useMangoStore((s) => s.selectedMarket.current)
  return (
    <div className={`relative buy-sell-title`}>
      <nav className="flex" aria-label="Tabs">
        <button
          onClick={() => onChange('buy')}
          className={`buy-sell-buttons buy default-transition py-2 relative flex w-1/2 cursor-pointer 
            items-center justify-center whitespace-nowrap hover:opacity-100 md:text-base
            ${
              side === 'buy'
                ? `active-buy-sel-border`
                : `border border-th-fgd-4 text-th-fgd-4 hover:border-th-green hover:text-th-green md:border-0`
            }
          `}
        >
          {market instanceof PerpMarket && isSimpleForm ? 'Long' : t('buy')}
        </button>
        <button
          onClick={() => onChange('sell')}
          className={`buy-sell-buttons sell default-transition  py-2 relative flex w-1/2 cursor-pointer 
            items-center justify-center whitespace-nowrap hover:opacity-100 md:text-base
            ${
              side === 'sell'
                ? `active-buy-sel-border`
                : `border border-th-fgd-4 text-th-fgd-4 md:border-0`
            }
          `}
        >
          {market instanceof PerpMarket && isSimpleForm
            ? capitalize(t('short'))
            : t('sell')}
        </button>
      </nav>
    </div>
  )
}

export default OrderSideTabs
