import React from 'react'
import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'


export default function Layout() {

    return (
        <>
            <NavBar />
            <div className='h-screen mt-8 flex'>
                <Sidebar />
                <Outlet/>
            </div>
        </>
    )
}
