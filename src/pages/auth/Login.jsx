import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../CSS/login.css' // <--- ADD THIS LINE
const  Login = ()=> {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await login(formData.email, formData.password)

    if (authError) {
      setError(authError.message)
    } else {
      navigate('/') // Redirect to Home on success
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}

export default Login;