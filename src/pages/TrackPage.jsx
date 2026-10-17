import React from 'react'
import { Link, useParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
import { PlaybackButton } from '../UI/Buttons/PlayButton'
// Hooks
import useFetch from '../hooks/useFetch'
import Modal from '../UI/Modal'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// utils
import { millisToMinutesAndSeconds } from '../utilities/helpers'

export default function TrackPage() {

    const params = useParams()
    const { data: track, errors: trackErrors } = useFetch(`https://api.spotify.com/v1/tracks/${params.id}?market=US`, params.id)

    if(trackErrors){
        return <Modal type='token-expired' open={true} />
    }

    return (
        <Container>
            {/* hero */}
            <div className='sp-hero -mx-4 md:-mx-6 -mt-6 px-4 md:px-6 pt-10 pb-6 flex flex-col md:flex-row gap-6 md:items-end'>
                <img src={track?.album?.images[1].url} className='w-48 h-48 lg:w-58 lg:h-58 object-cover rounded shadow-2xl shadow-black/60 self-center md:self-auto'/>
                <div className='min-w-0'>
                    <p className='text-sm font-medium'>Song</p>
                    <h5 className='font-black tracking-tight text-4xl md:text-5xl lg:text-7xl leading-tight my-2 wrap-break-word'>{track?.name}</h5>
                    <p className='text-sm'>
                        <Link to={`/artist/${track?.album?.artists[0]?.id}`} className='font-bold hover:underline'>{track?.album?.artists[0]?.name}</Link>
                        <span className='text-sp-subdued'>
                            {track?.album?.name && <> • <Link to={`/album/${track?.album?.id}`} className='hover:underline hover:text-white'>{track?.album?.name}</Link></>}
                            {track?.album?.release_date && ` • ${track?.album?.release_date?.slice(0, 4)}`}
                            {track?.duration_ms && ` • ${millisToMinutesAndSeconds(track?.duration_ms)}`}
                        </span>
                    </p>
                </div>
            </div>

            {/* action bar */}
            <div className='py-6 flex items-center gap-5'>
                {/* plays the song inside its album, so "next" continues with the album */}
                <PlaybackButton size={56} label={`Play ${track?.name ?? 'song'}`} matchUri={track?.uri}
                    options={track?.album?.uri ? { contextUri: track.album.uri, offsetUri: track.uri } : { uris: [track?.uri] }} />
            </div>
        </Container>
    )
}
