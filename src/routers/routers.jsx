import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
// route layout with sidebar and navbar
import Layout from './Layout'
// pages
import PreLoginPage from '../pages/PreLoginPage'
import ErrorPage from '../pages/ErrorPage'
import AlbumPage from '../pages/AlbumPage'
import MainPage from '../pages/MainPage'
import ArtistPage from '../pages/ArtistPage'
import AccountPage from '../pages/AccountPage'
import PlaylistPage from '../pages/PlaylistPage'
import TrackPage from '../pages/TrackPage'
// utils
import { checkUserToken } from '../utilities/checkUserToken'

export const routers_definitions2 = createBrowserRouter([   
    {
        path:'/',
        element: <Layout/>,
        errorElement:<ErrorPage/>,
        // loader : checkUserToken,
        children:[
            {path:'/',  element: <MainPage/>},
            {path:'/album/:id' , element:<AlbumPage/>},
            {path:'/artist/:id' , element:<ArtistPage/>},
            {path:'/playlist/:id' , element:<PlaylistPage/>},
            {path:'/track/:id', element:<TrackPage/>}
        ]
    },
    {
        path:'/login',
        errorElement:<ErrorPage/>,
        element: <PreLoginPage/>
    },
    {
        path:'/account',
        errorElement:<ErrorPage/>,
        element:<AccountPage/>
    }
])