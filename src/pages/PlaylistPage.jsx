import React, {useContext } from 'react'
import { useParams } from 'react-router-dom'
// Hooks
import useFetch from '../hooks/useFetch'
// context
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import Container from '../UI/Container'
import Modal from '../UI/Modal'
// Utils
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'
import { formatDate } from '../utilities/formatDate'
// icon
import { Music } from 'lucide-react'

export default function PlaylistPage() {

    //const sopt = useContext(SpotifyContext)
    const params = useParams()

    const { data: playlist, errors: playlistErrors } = useFetch(`https://api.spotify.com/v1/playlists/${params.id}?market=SA`, params.id)
    
    if (playlistErrors) {
        return <Modal type='token-expired' open={true} />
    }

    let userPlayList = playlist?.tracks?.items.length > 0

    // user has playlist
    const DisplayUserPlayList = () => {
        return (
        <div className='mt-10'>
            <div className='text-white text-sm font-normal'>
                <div className="grid grid-cols-12 gap-1 items-center px-4 py-3 border-b">
                    <div className='flex items-center col-span-3'>
                        <div className="w-10 text-gray-400">#</div>
                        <div className="font-semibold text-gray-300">Title</div>
                    </div>
                    <div className="col-span-3 text-gray-300">Song</div>
                    <div className="col-span-3 text-gray-300">Album</div>
                    <div className="col-span-3 text-gray-300 text-right pr-4">Duration</div>
                </div>
            </div>
            <div className='mt-5'>
                {playlist?.tracks?.items.map((track, index) =>
                    <div key={index + 1} className='grid grid-cols-12 gap-1 items-center px-4 py-3 hover:bg-light-gray-hover  rounded-lg'>
                        <div className='flex items-center col-span-3'>
                            <div className='w-10 font-medium'>{index + 1}</div>
                            <img className='rounded-xl' src={track?.track?.album?.images[2]?.url} />
                        </div>
                        <p className='col-span-3 font-normal hover:underline'>{track?.track?.name}</p>
                        <p className='col-span-3 font-normal'>{track?.track?.album.name}</p>
                        <p className='col-span-3 font-normal text-right pr-4'>{millisToMinutesAndSeconds(track?.track?.duration_ms)}</p>
                    </div>)}
            </div>
        </div>)
    }


    return (
        <Container>
            {/* start */}
            <div className='lg:flex gap-5 items-end'>
                {playlist?.images?.[1]?.url && <img src={playlist?.images?.[1]?.url} className='md:w-full lg:w-1/3' />}
                {!playlist?.images?.[1]?.url && <Music className='md:w-1/4 lg:w-1/4 h-full bg-gray-700'/>}
                <div className='leading-10'>
                    {/* <span className='capitalize'>{playlist?.type}</span> */}
                    <h2 className='mt-2 font-bold lg:text-4xl md:text-4xl'>{playlist?.name}</h2>
                    <p className='mt-2'>{`${playlist?.tracks?.total} songs`}</p>
                </div>
            </div>
            {/* end */}
            {/* traks */}
            {userPlayList && <DisplayUserPlayList />}
        </Container>
    )
}
