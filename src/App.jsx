import { useState, useEffect, useRef } from 'react'
import logo from './assets/logo.png'
import './App.css'

function App() {
  const [animationPhase, setAnimationPhase] = useState(0) // 0: loading, 1: Krishna, 2: Kunj, 3: by Jaipur Aashray, 4: landing page
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    propertyArea: '',
    budgetRange: '',
    requirements: ''
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 500)
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500)
    const timer3 = setTimeout(() => setAnimationPhase(3), 2500)
    const timer4 = setTimeout(() => setAnimationPhase(4), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://player.vimeo.com') return
      if (event.data.event === 'ended') {
        setShowThankYou(true)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      const message = isMuted ? { method: 'setVolume', value: 1 } : { method: 'setVolume', value: 0 }
      videoRef.current.contentWindow.postMessage(JSON.stringify(message), 'https://player.vimeo.com')
      setIsMuted(!isMuted)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://formspree.io/f/xqarwqzp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setIsModalOpen(true)
      } else {
        alert('Failed to submit form. Please try again.')
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message)
    }
  }

  const propertyOptions = [
    '1577.85 SQ.FT',
    '1695.77 SQ.FT',
    '1622.40 SQ.FT',
    '1406.07 SQ.FT',
    '1500.74 SQ.FT',
    '1579.72 SQ.FT',
    '1403.21 SQ.FT'
  ]

  if (animationPhase < 4) {
    return (
      <div className="entrance-animation">
        <div className="animation-container">
          <div className={`krishna-kunj-text ${animationPhase >= 1 ? 'show' : ''}`}>Krishna Kunj</div>
          <div className={`by-text ${animationPhase >= 2 ? 'show' : ''}`}>by Jaipur Aashray</div>
        </div>
      </div>
    )
  }

  return (
    <div className="landing-page">
      <header className="header">
        <img src={logo} alt="Krishna Kunj by Jaipur Aashray" className="logo" />
        <div className="exclusivity-badge">Limited Edition Homes</div>
      </header>
      <main className="main-content">
        <h1 className="headline">Are you looking for your dream home in Vaishali Nagar?</h1>
        <p className="subtext">Discover our exclusive 3BHK luxury flats at Krishna Kunj by Jaipur Aashray.</p>
        <div className="offer-banner">
          <h2>🎉 Exclusive Offer: Free Swift Car for the First 5 Bookings! 🎉</h2>
          <p>Book now and get a complimentary Swift car with your dream home.</p>
        </div>
        <form className="luxury-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact (WhatsApp preferred)</label>
            <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="propertyArea">Property Area (Super Built-Up Area)</label>
            <select id="propertyArea" name="propertyArea" value={formData.propertyArea} onChange={handleChange} required>
              <option value="">Select an option</option>
              {propertyOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="budgetRange">Budget Range</label>
            <input type="text" id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleChange} placeholder="e.g., 50-80 Lakhs" />
          </div>
          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Any specific requirements..."></textarea>
          </div>
          <button type="submit" className="cta-button">Unlock Your Private Walkthrough</button>
        </form>
      </main>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            {!showThankYou ? (
              <div className="video-container">
                {isVideoLoading && (
                  <div className="loading-overlay">
                    <p>Loading Video...</p>
                  </div>
                )}
                <div className="video-wrapper">
                  <iframe
                    ref={videoRef}
                    src="https://player.vimeo.com/video/1150303140?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&title=0&byline=0&portrait=0&quality=1080p&controls=0&rel=0&keyboard=0&fullscreen=0&pip=0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="IMG_1245"
                    className="walkthrough-video"
                  onLoad={() => {
                    setIsVideoLoading(false);
                    setTimeout(() => setShowThankYou(true), 40000);
                  }}
                    onContextMenu={(e) => e.preventDefault()}
                  ></iframe>
                  <button className="mute-button" onClick={toggleMute}>
                    {isMuted ? '🔊' : '🔇'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="thank-you-message">
                <h2>Thank you {formData.name} for showing interest in our property!</h2>
                <p>We will contact you soon with more details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
