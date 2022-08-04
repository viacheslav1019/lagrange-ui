/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */

import React, { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import Modal from './Modal'
import Button, { LinkButton } from './Button'
import Input, { Label } from './Input'
//@ts-ignore
import useMangoStore from '../stores/useMangoStore'
import useLocalStorageState from '../hooks/useLocalStorageState'
import Select from './Select'
import { useTranslation } from 'next-i18next'
import Switch from './Switch'
import { MarketKind } from '@blockworks-foundation/mango-client'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import ButtonGroup from './ButtonGroup'
import dayjs from 'dayjs'

require('dayjs/locale/en')
require('dayjs/locale/es')
require('dayjs/locale/zh')
require('dayjs/locale/zh-tw')

const NODE_URLS = [
  { label: 'Triton (RPC Pool)', value: 'https://mango.rpcpool.com' },
  {
    label: 'Genesys Go',
    value: 'https://mango.genesysgo.net/',
  },
  {
    label: 'Project Serum',
    value: 'https://solana-api.projectserum.com/',
  },
  { label: 'Custom', value: '' },
]

const THEMES = ['Light', 'Dark']

export const LANGS = [
  { locale: 'en', name: 'english', description: 'english' },
  { locale: 'es', name: 'spanish', description: 'spanish' },
  {
    locale: 'zh_tw',
    name: 'chinese-traditional',
    description: 'traditional chinese',
  },
  { locale: 'zh', name: 'chinese', description: 'simplified chinese' },
]

const CUSTOM_NODE = NODE_URLS.find((n) => n.label === 'Custom')

export const NODE_URL_KEY = 'node-url-key-0.6'
export const DEFAULT_MARKET_KEY = 'defaultMarket-0.3'
export const ORDERBOOK_FLASH_KEY = 'showOrderbookFlash'
export const DEFAULT_SPOT_MARGIN_KEY = 'defaultSpotMargin'
export const initialMarket = {
  base: 'SOL',
  kind: 'perp' as MarketKind,
  name: 'SOL-PERP',
  path: '/?name=SOL-PERP',
}

const SettingsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common')
  const [settingsView, setSettingsView] = useState('')
  const { theme } = useTheme()
  const [savedLanguage] = useLocalStorageState('language', '')
  const [rpcEndpointUrl] = useLocalStorageState(
    NODE_URL_KEY,
    NODE_URLS[0].value
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {!settingsView ? (
        <div className="settingsmodal">
          <button
            className="default-transition flex w-full items-center justify-between font-normal"
            onClick={() => setSettingsView('Theme')}
          >
            <span>{t('theme')}</span>
            <div className="flex items-center text-xs text-th-fgd-3">
              {theme}
              <ChevronRightIcon className="ml-1 h-5 w-5 text-th-fgd-1" />
            </div>
          </button>
        </div>
      ) : null}
      <SettingsContent
        settingsView={settingsView}
        setSettingsView={setSettingsView}
      />
    </Modal>
  )
}

export default React.memo(SettingsModal)

const SettingsContent = ({ settingsView, setSettingsView }) => {
  switch (settingsView) {
    case 'Theme':
      return <ThemeSettings setSettingsView={setSettingsView} />
    default:
      return null
  }
}

const ThemeSettings = ({ setSettingsView }) => {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('common')

  return (
    <div className="ThemeSettings">
      <Label>{t('theme')}</Label>
      <ButtonGroup
        className="theme-setting-button"
        activeValue={theme}
        onChange={(t) => setTheme(t)}
        values={THEMES}
      />
      <Button
        onClick={() => setSettingsView('')}
        className="mt-6 w-full hover:text-[#007C47]"
      >
        <div className={`flex items-center justify-center`}>{t('save')}</div>
      </Button>
    </div>
  )
}
