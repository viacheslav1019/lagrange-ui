//@typescript-eslint/no-unused-vars
/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link'
const Component4 = () => {
  return (
    <>
      <div className="Component4">
        <figure>
          <div className="planet3">
            <div className="lt1"> </div>
            <div className="figure2">
              <aside>
                <span className="span1">Lite version</span>
                <span className="span2">
                  A simple GUI for swaps between cash-backed stablecoins at the
                  lowest fees possible, with yields for Liquidity providers.
                </span>
                <div className="button">
                  <Link href="/swap">
                    <a>
                      Explore
                      <i
                        className="fa-solid fa-arrow-right"
                        style={{ marginLeft: '10px' }}
                      ></i>
                    </a>
                  </Link>
                </div>
              </aside>
              <div className="lt2"></div>
            </div>
          </div>
        </figure>
      </div>
    </>
  )
}

export default Component4
