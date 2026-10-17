import React from 'react'
import NavBar from '../components/NavBar'
import PlayerBar from '../components/PlayerBar'
import Sidebar from '../pages/SidebarPage'
import { Outlet } from 'react-router-dom'


export default function Layout() {

    return (
        <div className='h-screen flex flex-col bg-black text-white'>
            <NavBar />
            <div className='flex-1 min-h-0 px-2 pb-2'>
                <div className="sp-drawer drawer lg:drawer-open h-full">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <Outlet/>
                    </div>
                    <div className="drawer-side z-40 lg:pr-2">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="sp-scroll min-h-full lg:h-full w-80 p-2 rounded-lg bg-sp-base overflow-y-auto list-none">
                            <Sidebar/>
                        </ul>
                    </div>
                </div>
            </div>
            <PlayerBar />
        </div>
    )
}
