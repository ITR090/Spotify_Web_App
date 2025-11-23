import React, { useEffect, useContext, useState } from 'react'
import Spotify_Logo from '../assets/icons/Spotify_logo.png'
import Home_Logo from '../assets/icons/icons8-home-48.png'
import { Link } from 'react-router-dom'
// contexts
import { StoreContext } from '../store/ContextStore'
import { SpotifyContext } from '../store/SpotifyStore'
// Hooks
import useFetch from '../hooks/useFetch'
// UI
import SearchBar from '../UI/SearchBar'


export default function NavBar({ }) {


    const ctx = useContext(StoreContext)
    const ctxSpotify = useContext(SpotifyContext)
    const sopt = useContext(SpotifyContext)

    const { data: userProfile } = useFetch('https://api.spotify.com/v1/me')


    useEffect(() => {
        ctxSpotify.saveUserDetaild(userProfile)
    }, [userProfile])


    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <label htmlFor="my-drawer-3" className="btn drawer-button lg:hidden mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </label>
                </div>
                <div className='flex items-center'>
                    <Link to={'/'} className="mx-2">
                       <img src={Spotify_Logo} className='w-10 h-10' />
                    </Link>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <div className="flex items-center">
                    <Link to={'/'} className="mx-2">
                        <img src={Home_Logo} className='w-10 h-10 bg-black rounded-full p-2' />
                    </Link>
                    <SearchBar placeholder="What you want to play today?" />
                </div>
            </div>
            <div className="navbar-end">
               
                <div className="flex items-center">
                    {ctx.authenticated && <>
                        <img src={(ctx?.authenticated && userProfile) ? userProfile?.images[0]?.url : null} className='rounded-full w-10 h-10' alt="" />
                    </>
                    }
                </div>
            </div>
        </div>
    )
}
