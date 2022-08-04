//@typescript-eslint/no-unused-vars
// react/no-unescaped-entities
/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from 'next/link'

const Component1 = () => {
  return (
    <>
      <div className="Component1">
        <aside>
          <div className="planet"></div>
          <div className="planet1"></div>
        </aside>
        <aside>
          <span className="span1">
            Doesn&apos;t require any broker or settlement periods.
          </span>
          <span className="span2">
            Fully decentralized <br />
            24/7 FX market
          </span>
          <div className="buttondiv">
            <Link href="/swap">
              <a>
                <button>
                  Lite version
                  <i
                    className="fa-solid fa-arrow-right"
                    style={{ marginLeft: '10px' }}
                  ></i>
                </button>
              </a>
            </Link>

            <button>
              Pro version
              <span
                style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '700' }}
              >
                (soon)
              </span>
            </button>
          </div>
          <div className="powered">
            <span>POWERED BY</span>
            <div className="imgdiv">
              <img src="https://solana.com/_next/static/media/solanaLogo.74d35f7a.svg" />
              <img src="https://i.ibb.co/JCRzP61/serumdex-removebg-preview.png" />
            </div>
            <img />
          </div>
        </aside>
      </div>
    </>
  )
}

export default Component1
