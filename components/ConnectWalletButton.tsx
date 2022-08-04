/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import { Menu } from '@headlessui/react'
import { PROVIDER_LOCAL_STORAGE_KEY } from '../hooks/useWallet'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { DEFAULT_PROVIDER, WALLET_PROVIDERS } from '../utils/wallet-adapters'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { Wallet } from '@solana/wallet-adapter-react'
import { notify } from '../utils/notifications'

export const handleWalletConnect = (wallet: Wallet) => {
  if (!wallet) {
    return
  }
  if (wallet.readyState === WalletReadyState.NotDetected) {
    window.open(wallet.adapter.url, '_blank')
  } else {
    wallet?.adapter?.connect().catch((e) => {
      if (e.name.includes('WalletLoadError')) {
        notify({
          title: `${wallet.adapter.name} Error`,
          type: 'error',
          description: `Please install ${wallet.adapter.name} and then reload this page.`,
        })
      }
    })
  }
}

const ConnectWalletButton = () => {
  const [toggle, setToggle] = useState(Boolean)
  const setMangoStore = useMangoStore((s) => s.set)
  const handleSelectProvider = (url) => {
    setMangoStore((state) => {
      state.wallet.providerUrl = url
      setToggle(true)
    })
  }
  const { t } = useTranslation('common')
  const wallet = useMangoStore((s) => s.wallet.current)
  const mangoGroup = useMangoStore((s) => s.selectedMangoGroup.current)
  const pfp = useMangoStore((s) => s.wallet.pfp)
  const connected = useMangoStore((s) => s.wallet.connected)
  const set = useMangoStore((s) => s.set)
  const [selectedWallet, setSelectedWallet] = useState(DEFAULT_PROVIDER.url)
  const [savedProviderUrl] = useLocalStorageState(
    PROVIDER_LOCAL_STORAGE_KEY,
    DEFAULT_PROVIDER.url
  )

  // update in useEffect to prevent SRR error from next.js
  useEffect(() => {
    setSelectedWallet(savedProviderUrl)
  }, [savedProviderUrl])

  const handleWalletConect = () => {
    wallet.connect()
    set((state) => {
      state.selectedMangoAccount.initialLoad = true
    })
    // setToggle(false)
  }

  const handleWalletDisConect = () => {
    wallet.disconnect()
    setToggle(false)
  }

  return (
    <>
      {connected && wallet?.publicKey ? (
        <Menu>
          {({ open }) => (
            <div className="relative ConnectWalletButton" id="profile-menu-tip">
              <Menu.Item>
                <button onClick={handleWalletDisConect}>Disconnect</button>
              </Menu.Item>
            </div>
          )}
        </Menu>
      ) : (
        <div className="ConnectWalletButton">
          {toggle && (
            <button
              onClick={handleWalletConect}
              disabled={!wallet || !mangoGroup}
            >
              Connect Wallet
            </button>
          )}
          {!toggle && (
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button
                    className={`flex justify-center items-center h-full rounded-none focus:outline-none text-light-theme-lagrangewalletcolor hover:brightness-[1.1] cursor-pointer w-10`}
                  >
                    Select Wallet
                  </Menu.Button>
                  <Menu.Items className="absolute" style={{ zIndex: '100000' }}>
                    {WALLET_PROVIDERS.map(({ name, url, icon }) => (
                      <Menu.Item key={name}>
                        <button
                          className="walletlist"
                          onClick={() => handleSelectProvider(url)}
                        >
                          <div className="imgspan">
                            <img src={icon} />
                            <span> {name} </span>
                          </div>
                        </button>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </>
              )}
            </Menu>
          )}
        </div>
      )}
    </>
  )
}

export default ConnectWalletButton
