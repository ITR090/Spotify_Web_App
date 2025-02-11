import React ,{useEffect,useContext,useState} from 'react'
import Spotify_Logo from '../assets/icons/Spotify_logo.png'
import Home_Logo from '../assets/icons/icons8-home-48.png'
import { Link } from 'react-router-dom'
// contexts
import { StoreContext } from '../store/ContextStore'
import { SpotifyContext } from '../store/SpotifyStore'
// Hooks
import useFetch from '../hooks/useFetch'

export default function NavBar({}) {


    const ctx = useContext(StoreContext)
    const ctxSpotify = useContext(SpotifyContext)
    
    const {data : userProfile} = useFetch('https://api.spotify.com/v1/me') 
    console.log('navbar')

    useEffect(()=>{
        ctxSpotify.saveUserDetaild(userProfile)
    },[userProfile])
    

    return (<nav className="bg-black">
        <div className="flex flex-wrap items-center justify-between p-4">

            <div className='flex items-center'>
                <img src={Spotify_Logo} className='w-7 h-7'/>
            </div>
            <div className="flex items-center">
                <Link to={'/'} className="mx-2">
                       <img src={Home_Logo}  className='w-7 h-7 hover:bg-[#2a2a2a] rounded-full' />
                </Link>
                <div className="rounded-2xl">
                    <input type="search" id="search-navbar" className="w-96 p-2 pl-6  rounded-2xl" placeholder="What you want to play?" />
                </div>  
            </div>

            <div className="flex items-center">
                    {ctx.authenticated && <>
                        <img src={(ctx?.authenticated && userProfile) ? userProfile?.images[0]?.url : null} className='rounded-full w-9' alt=""/>
                    </>
                    }
            </div>
        </div>
    </nav>
    )
}
