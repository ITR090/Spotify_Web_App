import React from 'react'
import { useParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
// Hooks
import useFetch from '../hooks/useFetch'
// icon
import verified from '../assets/icons/verified.png'
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'
// utils


export default function ArtistPage() {

    const params = useParams()
    const { data: artist } = useFetch(`https://api.spotify.com/v1/artists/${params.id}`, params.id)
    const { data: topTracks } = useFetch(`https://api.spotify.com/v1/artists/${params.id}/top-tracks?market=SA`,params.id)
    const {data: albmus} =useFetch(`https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=album&market=SA`)
    
    return (
        <Container>
            {/* start */}
            <div className='leading-10 flex items-center gap-4'>
                <div>
                    <img src={artist?.images[1]?.url} className='rounded-full w-56' />
                </div>
                <div>
                    <div className='flex gap-2 items-center'>
                        <span><img src={verified} width={32} height={32} /></span>
                        <span className='text-lg'>Verified Artist</span>
                    </div>
                    <h4 className='capitalize text-5xl font-bold'>{artist?.name}</h4>
                    <p className='font-medium'>{artist?.followers?.total?.toLocaleString('en-US')} followers</p>
                    <button className='border-2 border-solid text-lg rounded-full p-1 mr-2 w-full'>Following</button>
                </div>
            </div>
            {/* end */}
            {/* start */}
            <div className='mt-5'>
                <h3 className='capitalize text-2xl font-bold'>Popular</h3>
                <div className='flex-col mt-5'>
                    {topTracks?.tracks?.map((track,index) =>
                        <div key={track?.id} className='flex justify-between items-center hover:bg-light-gray-hover p-2 rounded-lg'>
                            <div>
                                <div>
                                    {/* <img src={track} /> */}
                                    <div className='flex items-center gap-3'>
                                        <p className='font-medium'>{index+1}</p>
                                        <h6 className='font-medium hover:underline'>{track?.name}</h6>
                                    </div>
                                </div>
                                {/* {album?.artists.map(artist =>
                                    <>
                                        <span className='text-light-gray font-medium hover:underline'>{artist?.name}</span>
                                    </>
                                )} */}
                            </div>
                            <div>
                                <p className='text-light-gray font-medium'>{millisToMinutesAndSeconds(track?.duration_ms)}</p>
                            </div>
                        </div>)}
                </div>
            </div>
            {/* end */}



        </Container>
    )
}
