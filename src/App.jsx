import React from 'react'
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
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout'
import Login from './components/login'
import Dashboard from './components/dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './components/signup'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<ProtectedRoute/>}>
       <Route path="/dashboard" element={<Layout><Dashboard/></Layout>} />
      </Route>

       <Route path="/login" element={<Login/>} />
       <Route path="/signup" element={<Signup/>} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App