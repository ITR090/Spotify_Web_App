import React ,{useEffect,useContext,useState} from 'react'
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


export default function NavBar({}) {


    const ctx = useContext(StoreContext)
    const ctxSpotify = useContext(SpotifyContext)
    const sopt = useContext(SpotifyContext)
    
    const {data : userProfile} = useFetch('https://api.spotify.com/v1/me') 
   

    useEffect(()=>{
        ctxSpotify.saveUserDetaild(userProfile)
    },[userProfile])
    

    return (<nav className="bg-black">
        <div className="flex flex-wrap items-center justify-between p-4">

            <div className='flex items-center'>
                <img src={Spotify_Logo} className='w-10 h-10'/>
            </div>
            <div className="flex items-center">
                <Link to={'/'} className="mx-2">
                       <img src={Home_Logo}  className='w-10 h-10 bg-[#2a2a2a] rounded-full p-2' />
                </Link>
                <SearchBar placeholder="What you want to play today?"/>
            </div>

            <div className="flex items-center">
                    {ctx.authenticated && <>
                        <img src={(ctx?.authenticated && userProfile) ? userProfile?.images[0]?.url : null} className='rounded-full w-10 h-10' alt=""/>
                    </>
                    }
            </div>
        </div>
    </nav>
    )
}
