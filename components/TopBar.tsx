/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ConnectWalletButton from './ConnectWalletButton'
import { useRouter } from 'next/router'
import Settings from './Settings'

const TopBar = () => {
  const burgerb = useRef(String)
  const [a, setA] = useState(false)
  const router = useRouter()
  const [matches, setMatches] = useState(
    window.matchMedia('(max-width: 768px)').matches
  )

  useEffect(() => {
    window
      .matchMedia('(min-width: 768px)')
      .addEventListener('change', (e) => setMatches(e.matches))
  }, [])

  const burger = (e) => {
    setA((prevState) => !prevState)
    // console.log(
    //   e.target.parentNode.parentNode.previousElementSibling.children[1]
    // )

    if (a === true) {
      e.target.classList.remove('deactivemenu')
      burgerb.current.style.display = 'hidden'
    } else {
      e.target.classList.add('deactivemenu')
      burgerb.current.style.visibility = 'visible'
    }
  }

  const times = (e) => {
    setA((prevState) => !prevState)

    if (a === true) {
      e.target.classList.remove('deactivemenu')
      burgerb.current.style.visibility = 'hidden'
    } else {
      e.target.classList.add('deactivemenu')
      burgerb.current.style.visibility = 'visible'
    }
  }

  return (
    <>
      <div className="topbar">
        <nav>
          <Link href="/">
            <a className="flex items-center">
              <div className="img"></div>
              {router.asPath.includes('/pro') && (
                <div className="ml-2 mt-3 xl:text-[30px] lg:text-[25px] md:text-[20px] font-black text-[#FD9F81] leading-[26px]">
                  PRO
                </div>
              )}
            </a>
          </Link>
          {!router.asPath.includes('/pro') && (
            <ul ref={burgerb}>
              <li>
                <img
                  src="/assets/icons/cancel.png"
                  className="fa-times"
                  alt=""
                  onClick={times}
                />
              </li>
              <li className={router.asPath == '/swap' ? 'active' : ''}>
                <Link href="/swap">
                  <a>
                    Swap
                    <div
                      className={
                        router.asPath == '/swap' ? 'activetop' : 'deactivetop'
                      }
                    ></div>
                  </a>
                </Link>
              </li>
              <li className={router.asPath == '/overview' ? 'active' : ''}>
                <Link href="/overview">
                  <a>
                    Market Overview
                    <div
                      className={
                        router.asPath == '/overview'
                          ? 'activetop'
                          : 'deactivetop'
                      }
                    ></div>
                  </a>
                </Link>
              </li>
              <li className={router.asPath == '/pools' ? 'active' : ''}>
                <Link href="/pools">
                  <a>
                    Pools
                    <div
                      className={
                        router.asPath == '/pools' ? 'activetop' : 'deactivetop'
                      }
                    ></div>
                  </a>
                </Link>
              </li>
              {matches && (
                <li>
                  <ConnectWalletButton />{' '}
                </li>
              )}
            </ul>
          )}

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!matches && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Settings />
                <ConnectWalletButton />
              </div>
            )}
            {matches && <Settings />}
            <div className="burger" onClick={burger}>
              <i className="fas fa-bars"></i>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default TopBar
