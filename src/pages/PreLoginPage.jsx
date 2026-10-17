import React ,{} from 'react'
import { Link, useSearchParams } from 'react-router-dom'

// messages for the ?error= values sent back by the backend /callback route
const LOGIN_ERRORS = {
  access_denied: 'You cancelled the Spotify login. Connect again to continue.',
  missing_code: "Spotify didn't return a login code. Please try again.",
  token_exchange_failed: "We couldn't complete the Spotify login. Please try again.",
}

export default function PreLoginPage() {

  const [searchParams] = useSearchParams()
  const loginError = searchParams.get('error')

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-linear-to-b from-sp-highlight to-black p-4 sm:p-8'>
      <div className='w-full max-w-lg bg-sp-base rounded-lg px-6 py-12 sm:px-16 flex flex-col items-center text-center shadow-2xl shadow-black/60'>
        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Green.png" alt="Spotify" className='w-56 sm:w-64' />
        <h1 className='mt-10 text-3xl sm:text-4xl font-black tracking-tight'>Millions of songs.<br/>Free on Spotify.</h1>
        <p className='mt-4 text-sp-subdued'>Connect your Spotify account to see your top artists, tracks, playlists and library.</p>
        {loginError &&
          <div role='alert' className='w-full mt-6 rounded-md bg-[#e91429] text-white text-sm font-medium px-4 py-3'>
            {LOGIN_ERRORS[loginError] ?? 'Something went wrong while logging in. Please try again.'}
          </div>
        }
        <button onClick={()=> window.location.href = "http://localhost:8888/spotify-login"} type="button" className='w-full rounded-full px-8 py-3.5 mt-10 text-base font-bold bg-sp-green text-black hover:bg-sp-green-hover hover:scale-[1.03] transition-all cursor-pointer'>Connect to Spotify</button>
      </div>
    </div>
  )
}
