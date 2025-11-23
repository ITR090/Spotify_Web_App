import React from 'react'
import { Link, useParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
// Hooks
import useFetch from '../hooks/useFetch'
// icon
import verified from '../assets/icons/verified.png'
// utils
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'
// UI
import Slider from '../components/Slider'
import Modal from '../UI/Modal'
// Import Swiper React components
import { SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import SecondaryButton from '../UI/Buttons/SecondaryButton'
import play_button from '../assets/icons/play-button.png'
import checked from '../assets/icons/checked.png'

export default function TrackPage() {

    const params = useParams()
    const { data: track, errors: trackErrors } = useFetch(`https://api.spotify.com/v1/tracks/${params.id}?market=US`, params.id)
    
    if(trackErrors){
             return <Modal type='token-expired' open={true} />
    }

    return (
        <Container>
            <div className='lg:flex items-center gap-3'>
                <img src={track?.album?.images[1].url} />
                <div className=''>
                    {/* <span>{track?.album?.album_type}</span> */}
                    <h5 className='font-bold lg:text-6xl my-5'>{track?.name}</h5>
                    <span>{track?.album?.artists[0]?.name}</span>
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
