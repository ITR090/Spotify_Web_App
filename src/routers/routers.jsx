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
import PlaylistPage from '../pages/PlaylistPage'
import TrackPage from '../pages/TrackPage'


export const routers_definitions2 = createBrowserRouter([   
    {
        path:'/',
        element: <Layout/>,
        errorElement:<ErrorPage/>,
        // loader : 
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
    }
])