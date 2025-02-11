import React, { useEffect, useState, useContext } from 'react'
import NavBar from '../components/NavBar'
import Sidebar from '../components/Sidebar'
import MainPage from './MainPage'
import { StoreContext } from '../store/ContextStore'
import {BrowserRouter, Route, Routes } from 'react-router-dom'

export default function FrontPage() {


    const ctx = useContext(StoreContext)

    useEffect(() => {
        if (!ctx.token) {
            let url = new URL(window.location.href)
            let token = url.searchParams.get('access_token')
            ctx.setUserToken(token)
            ctx.setAuthenticated(true)
        }
    }, [ctx.token])



    return (
        <>
            {ctx.authenticated && <>
                <NavBar />
                <div className='h-screen mt-8 flex'>
                    <Sidebar />
                    <MainPage />
                </div>
            </>}
        </>
    )
}
