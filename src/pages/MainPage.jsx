import React, { useContext,useState } from 'react'
import { StoreContext } from '../store/ContextStore'
// UI
import Container from '../UI/Container'
import { Link, Navigate} from 'react-router-dom'
import Slider from '../components/Slider'
// HOOKS
import useFetch from '../hooks/useFetch'
// Import Swiper React components
import { SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import Modal from '../UI/Modal'



export default function MainPage() {

    const ctx = useContext(StoreContext)
    const { data: topArtists, errors : topArtistsErr } = useFetch('https://api.spotify.com/v1/me/top/artists?limit=20')
    const { data: topTracks, errors : topTracksErr } = useFetch('https://api.spotify.com/v1/me/top/tracks?limit=20')

    
    if(topArtistsErr && topTracksErr){
         return <Modal type='token-expired' open={true} />
    }

    return (
        <Container>

            <h5 className='my-6 text-xl font-bold capitalize'>Your favorite artists</h5>

            <Slider>
                {topArtists && topArtists.items?.map((artist) =>
                    <SwiperSlide key={artist?.id} style={{ width: '12%', height: 'auto' }}>
                        <Link to={`/artist/${artist.id}`}>
                            <div key={artist.id} className='rounded-lg hover:bg-light-gray-hover p-1'>
                                <img src={artist.images[2].url} className='rounded-full w-48' />
                                <h5 className='mt-3'>{artist.name}</h5>
                                <span className='capitalize'>{artist.type}</span>
                            </div>
                        </Link>
                    </SwiperSlide>

                )}
            </Slider>

            <h5 className='my-6 text-xl font-bold capitalize'>Recently played</h5>
            <Slider>
                {topTracks && topTracks.items?.map((track) =>
                    <SwiperSlide key={track?.id} style={{ width: '12%', height: 'auto' }}>
                        <Link to={`/track/${track.id}`}>
                            <div key={track.id} className='rounded-lg hover:bg-light-gray-hover p-1'>
                                <img src={track.album.images[0].url} className='rounded-lg w-48' />
                                <h5 className='mt-3'>{track.name}</h5>
                            </div>
                        </Link>
                    </SwiperSlide>
                )}
            </Slider>
        </Container>
    )
}