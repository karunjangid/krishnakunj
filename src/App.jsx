import { useState, useEffect } from 'react'
import logo from './assets/logo.png'
import walkthroughVideo from './assets/walkthrough.mp4'
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
              <video autoPlay muted controls className="walkthrough-video" onEnded={() => setShowThankYou(true)}>
                <source src={walkthroughVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
