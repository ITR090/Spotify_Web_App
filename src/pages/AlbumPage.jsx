import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
// context
import { StoreContext } from '../store/ContextStore'
// UI
import Container from '../UI/Container'
import Modal from '../UI/Modal'
// Hooks
import useFetch from '../hooks/useFetch'
// components
import AlbumTracks from '../components/AlbumTracks'
// utils
import { formatDate } from '../utilities/helpers'
// icons
import play_button from '../assets/play-button.png'
// import checked from '../assets/checked.png'

export default function AlbumPage() {

    const params = useParams()
    const ctx = useContext(StoreContext)

    const { data: album, errors: albmuError } = useFetch(`https://api.spotify.com/v1/albums/${params.id}?market=US`, params.id)

    if (albmuError) {
        return <Modal type='token-expired' open={true} />
    }
    

    return (
        <Container>
            {/* <Album album={album}/> */}

            {/* start */}
            <div className='lg:flex gap-5 items-end'>
                <img src={album?.images[1]?.url} alt="" width={260} height={260} />
                <div className='sm:my-2'>
                    <h2 className='font-bold lg:text-6xl'>{album?.name}</h2>
                    <p className='my-2'>{album?.artists[0]?.name}</p>
                    <p className=''> <span className='capitalize'>{album?.album_type}</span> {` . ${formatDate(album?.release_date)} . ${album?.total_tracks} songs`}</p>
                </div>
            </div>
            {/* end */}

            {/* start */}
            <div className='mt-10 flex items-center gap-5'>
                <div>
                    <img src={play_button} />
                </div>
                {/* <div>
                    <img src={checked} />
                </div>  */}
            </div>
            {/* end */}

            {/* start */}
            <div className='mt-10'>
                <div className='flex-col mt-5'>
                    {album?.tracks?.items.map((album) => <AlbumTracks key={album?.id} album={album} />)}
                </div>
            </div>
            {/* end */}

            <div className='mt-10'>
                <p className='text-light-gray'>{album?.release_date}</p>
                {album?.copyrights.map(copyright => <p key={copyright.text} className='text-light-gray'>{copyright.text}</p>)}
            </div>

        </Container>
    )
}
