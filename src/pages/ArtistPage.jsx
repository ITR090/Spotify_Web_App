import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
// Hooks
import useFetch from '../hooks/useFetch'
// UI
import Slider from '../components/Slider'
import SecondaryButton from '../UI/Buttons/SecondaryButton'
import Modal from '../UI/Modal'
// Import Swiper React components
import { SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// Components
import TopTracksList from '../components/TopTracksList'


export default function ArtistPage() {

    const params = useParams()
    const { data: artist, errors: errorsArtist } = useFetch(`https://api.spotify.com/v1/artists/${params.id}`, params.id)
    const { data: topTracks, errors: errorsTopTracks } = useFetch(`https://api.spotify.com/v1/artists/${params.id}/top-tracks?market=SA`, params.id)
    const { data: albmus, errors: albmusErrors } = useFetch(`https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=album&market=US`, params.id)


    if (errorsArtist && errorsTopTracks && albmusErrors) {
        return <Modal type='token-expired' open={true} />
    }

    return (
        <Container>
            {/* start */}
            <div className='relative w-full h-80 rounded-xl overflow-hidden'>
                <img src={artist?.images[0]?.url} className='absolute inset-0 w-full h-full object-cover ' />
                {/* Dark Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                {/* Text Overlay */}
                <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="lg:text-6xl md:font-medium sm:font-light md:text-base font-extrabold">{artist?.name}</h1>
                    <p className="mt-2 text-sm opacity-80">
                        {artist?.followers?.total?.toLocaleString('en-US')} followers
                    </p>
                </div>
            </div>
            {/* end */}

            {/* start */}
            <div className='mt-5'>
                <h3 className='capitalize text-2xl font-bold'>Popular Tracks</h3>
                <div className='flex-col mt-5'>
                    {topTracks?.tracks?.map((track) => <TopTracksList key={track.id} track={track}/>)}
                </div>
            </div>
            {/* end */}

            {/* START */}

            <div className='mt-5'>
                <h3 className='capitalize text-2xl font-bold mb-5'>Discography</h3>
                {/* <SecondaryButton type="button">Albums</SecondaryButton>
                <SecondaryButton type="button">Singles and EPs</SecondaryButton> */}

                <div className='mt-5'>
                    <Slider>
                        {albmus && albmus.items.map((albmu => <SwiperSlide key={albmu.id} style={{ width: 'auto', height: 'auto' }}>
                            <Link to={`/album/${albmu.id}`}>
                                <div key={albmu.id} className='rounded-lg hover:bg-light-gray-hover p-1'>
                                    <img src={albmu?.images[0].url} className='rounded-lg w-50' />
                                    <h5 className='mt-3'>{albmu.name}</h5>
                                </div>
                            </Link>
                        </SwiperSlide>))}
                    </Slider>
                </div>
            </div>

            {/* end */}
        </Container>
    )
}
