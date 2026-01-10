import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AddBook from './pages/booklisting/AddBook'
import Navbar from './components/Navbar'
import MyBooks from './pages/MyBooks'
import Home from './pages/booklisting/Home'
import BookDetails from './pages/booklisting/BookDetails'
import Notifications from './pages/Notifications'
import IncomingRequests from './pages/IncommingRequests'
import BookHistory from './pages/BookHistory'
import BuyPoints from './pages/BuyPoints'
import ExchangeMap from './pages/ExchangeMap'
import BookForum from './pages/forum/BookForum'


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
    <Route path="/book/:id" element={<BookDetails />} />
    <Route path="/notifications" element={<Notifications/>} />
    <Route path="/requests" element={<IncomingRequests />} />
<Route path="/history/:id" element={<BookHistory />} />
<Route path="/buy-points" element={<BuyPoints />} />
<Route path="/map" element={<ExchangeMap />} />
<Route path="/forums" element={<BookForum />} />
          {/* Add more private routes here later, e.g.:
              <Route path="/add-book" element={<AddBook />} /> 
          */}
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App