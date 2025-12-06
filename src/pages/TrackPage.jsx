import React from 'react'
import { useParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
// Hooks
import useFetch from '../hooks/useFetch'
import Modal from '../UI/Modal'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// icons
import play_button from '../assets/play-button.png'
import checked from '../assets/checked.png'

export default function TrackPage() {

    const params = useParams()
    const { data: track, errors: trackErrors } = useFetch(`https://api.spotify.com/v1/tracks/${params.id}?market=US`, params.id)
    
    if(trackErrors){
        return <Modal type='token-expired' open={true} />
    }

    return (
        <Container>
            <div className='lg:flex md:flex items-center gap-3'>
                <img src={track?.album?.images[1].url} className='w-full sm:w-1/2 md:w-1/3'/>
                <div>
                    <h5 className='font-bold md:text-5xl lg:text-6xl sm:text-lg my-5'>{track?.name}</h5>
                    <span className='md:text-5xl lg:text-6xl sm:text-lg'>{track?.album?.artists[0]?.name}</span>
                </div>
            </div>

            {/* start */}
            <div className='mt-10 flex items-center gap-5'>
                <div>
                    <img src={play_button} />
                </div>               
            </div>
            {/* end */}
        </Container>
    )
}
