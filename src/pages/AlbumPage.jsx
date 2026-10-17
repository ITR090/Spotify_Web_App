import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
// context
import { StoreContext } from '../store/ContextStore'
// UI
import Container from '../UI/Container'
import Modal from '../UI/Modal'
import PlayButton from '../UI/Buttons/PlayButton'
// Hooks
import useFetch from '../hooks/useFetch'
// components
import AlbumTracks from '../components/AlbumTracks'
// playback
import { usePlayback } from '../store/PlayerStore'
// utils
import { formatDate } from '../utilities/helpers'
// icons
import { Clock3 } from 'lucide-react'
// import checked from '../assets/checked.png'

export default function AlbumPage() {

    const params = useParams()
    const ctx = useContext(StoreContext)

    const { data: album, errors: albmuError } = useFetch(`https://api.spotify.com/v1/albums/${params.id}?market=US`, params.id)

    // big green button plays the whole album
    const { isPlaying: albumPlaying, onPlay: onPlayAlbum } = usePlayback(album?.uri, { contextUri: album?.uri })

    if (albmuError) {
        return <Modal type='token-expired' open={true} />
    }


    return (
        <Container>
            {/* hero */}
            <div className='sp-hero -mx-4 md:-mx-6 -mt-6 px-4 md:px-6 pt-10 pb-6 flex flex-col md:flex-row gap-6 md:items-end'>
                <img src={album?.images[1]?.url} alt="" className='w-48 h-48 lg:w-58 lg:h-58 object-cover rounded shadow-2xl shadow-black/60 self-center md:self-auto' />
                <div className='min-w-0'>
                    <p className='text-sm font-medium capitalize'>{album?.album_type}</p>
                    <h2 className='font-black tracking-tight text-4xl md:text-5xl lg:text-7xl leading-tight my-2 wrap-break-word'>{album?.name}</h2>
                    <p className='text-sm text-white/90'>
                        <span className='font-bold text-white hover:underline cursor-pointer'>{album?.artists[0]?.name}</span>
                        <span className='text-sp-subdued'>{` • ${formatDate(album?.release_date)} • ${album?.total_tracks} songs`}</span>
                    </p>
                </div>
            </div>

            {/* action bar */}
            <div className='py-6 flex items-center gap-5'>
                <PlayButton size={56} onClick={album ? onPlayAlbum : undefined} isPlaying={albumPlaying} label={`Play ${album?.name ?? 'album'}`} />
            </div>

            {/* tracklist */}
            <div>
                <div className='grid grid-cols-[2rem_1fr_auto] gap-4 items-center px-4 pb-2 mb-2 border-b border-white/10 text-sm text-sp-subdued'>
                    <span className='text-right'>#</span>
                    <span>Title</span>
                    <span className='flex justify-end pr-8'><Clock3 size={16} /></span>
                </div>
                <div className='flex flex-col'>
                    {album?.tracks?.items.map((track) => <AlbumTracks key={track?.id} album={track} albumUri={album?.uri} />)}
                </div>
            </div>

            <div className='mt-10 mb-6 text-xs text-sp-subdued space-y-1'>
                <p className='text-sm text-light-gray'>{album?.release_date}</p>
                {album?.copyrights.map(copyright => <p key={copyright.text} className='text-light-gray'>{copyright.text}</p>)}
            </div>

        </Container>
    )
}
