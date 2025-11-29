import React from 'react'
import NavBar from '../components/NavBar'
import Sidebar from '../pages/SidebarPage'
import { Outlet } from 'react-router-dom'


export default function Layout() {

    return (
        <>
            <NavBar />
            <div className='h-auto mt-8 flex'>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <Outlet/>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu min-h-full w-80 p-4 rounded-lg bg-gray-800">
                            <Sidebar/>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
