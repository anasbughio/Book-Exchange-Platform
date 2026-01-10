import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AddBook from './pages/booklisting/AddBook'
import Navbar from './components/Navbar'
import MyBooks from './pages/MyBooks'
import Home from './pages/booklisting/Home'


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Requires Login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
    <Route path="/add-book" element={<AddBook />} />
    <Route path="/my-books" element={<MyBooks />} />

          {/* Add more private routes here later, e.g.:
              <Route path="/add-book" element={<AddBook />} /> 
          */}
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App