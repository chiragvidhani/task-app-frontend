import React, { useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './layout'
import Login from './components/login'
import Dashboard from './components/dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './components/signup'
import useAuthStore from './store/authStore'

const App = () => {
  
  return (
    <Layout>
    <BrowserRouter>
    <Routes>
      <Route element={<ProtectedRoute/>}>
       <Route path="/" element={<Layout><Dashboard/></Layout>} />
      </Route>

       <Route path="/login" element={<Login/>} />
       <Route path="/signup" element={<Signup/>} />
    </Routes>
    
    </BrowserRouter>
    </Layout>
  )
}

export default App