import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


const Signup = ()=> {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '' 
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
    }

    // Call context signup function
    const { error: authError } = await signup(
        formData.email, 
        formData.password, 
        formData.fullName
    )

    if (authError) {
      setError(authError.message)
    } else {
      alert('Registration Successful! Please check your email for verification.')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Full Name" 
          required
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Email" 
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}

export default Signup;