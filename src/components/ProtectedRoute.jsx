import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore';
const ProtectedRoute = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    console.log(isLoggedIn)

return (
    isLoggedIn ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default ProtectedRoute