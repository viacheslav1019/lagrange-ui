//@typescript-eslint/no-unused-vars
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
const Component2 = () => {
  const [data, setData] = useState([
    {
      img: '/image/icon1.png',
      value1: 'Angle Protocol',
      value2: 'agEUR',
    },
    {
      img: '/image/icon4.png',
      value1: 'USD Coin',
      value2: 'USDC',
    },
    {
      img: '/image/icon2.png',
      value1: 'BiLira',
      value2: 'TRYB',
    },
    {
      img: '/image/icon3.png',
      value1: 'Brazilian Digital Token',
      value2: 'BRZ',
    },
  ])
  return (
    <>
      <div className="Component2">
        {data.map((d) => {
          return (
            <div key="d.value1">
              <img src={d.img} />
              <div className="spandiv">
                <span className="span1">{d.value1}</span>
                <span className="span2">{d.value2}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Component2
