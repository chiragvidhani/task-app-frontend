import React from 'react'
import useAuthStore from '../store/authStore';
import {Button} from "@/components/ui/button"
import { LogOut } from 'lucide-react';

const Logout = () => {
    const logout = useAuthStore((state) => state.logout);
  return (
    <div className='self-end p-3'>
        <Button onClick={() => {logout()}}><LogOut/> Logout</Button>
    </div>
  )
}

export default Logout