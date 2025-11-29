import React ,{} from 'react'
import { Link } from 'react-router-dom'


export default function PreLoginPage() {


  return (
    <div className='flex flex-col justify-center items-center content-center h-screen w-screen'>
        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Green.png" />
        <button onClick={()=> window.location.href = "http://localhost:8888/spotify-login"} type="button" className=' rounded-3xl px-20 py-4 mt-4 text-xl'>Connect to Spotify</button>
    </div>
  )
}






