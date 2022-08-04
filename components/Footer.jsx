const Footer = () => {
  return (
    <>
      <div className="Footer">
        <div
          style={{
            width: 'clamp(200px,26.3888vw, 380px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <img
            style={{
              width: 'clamp(20px, 2.2222vw, 32px)',
              color: '#BCBCBC',
            }}
            src="/assets/d.png"
          />
          <img
            style={{
              width: 'clamp(20px, 2.2222vw, 32px)',
              color: '#BCBCBC',
            }}
            src="/assets/discord.png"
          />
          <img
            style={{
              width: 'clamp(20px, 2.2222vw, 32px)',
              color: '#BCBCBC',
            }}
            src="/assets/telegram.png"
          />
          <img
            style={{
              width: 'clamp(20px, 2.2222vw, 32px)',
              color: '#BCBCBC',
            }}
            src="/assets/twitter.png"
          />
        </div>
      </div>
    </>
  )
}

export default Footer
