import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check active session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    checkSession()

    // 2. Listen for changes (login, logout, auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Core Auth Functions
  const login = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signup = (email, password, fullName) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName } // Passed to triggers [cite: 15]
      }
    })
  }

  const logout = () => {
    return supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}