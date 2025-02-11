import React, { useEffect, useContext, useState } from 'react'
import { data, useParams } from 'react-router-dom'
// Hooks
import useFetch from '../hooks/useFetch'
// context
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import Container from '../UI/Container'
// Utils
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'


export default function PlaylistPage() {

    const ctxSpotify = useContext(SpotifyContext)
    const params = useParams()
    const { data: playlist } = useFetch(`https://api.spotify.com/v1/playlists/${params.id}?market=SA`)
    return (
        <Container>
            {/* start */}
            <div className='flex gap-5 items-end'>
                <img src={playlist?.images?.[1]?.url} width={260} height={260} />
                <div className='leading-10'>
                    <span className='capitalize'>{playlist?.type}</span>
                    <h2 className='font-bold text-6xl'>{playlist?.name}</h2>
                    <p className='mt-5'>{`${playlist?.tracks?.total} songs`}</p>
                </div>
            </div>
            {/* end */}

            {/* traks */}

            <div className='mt-10'>
                <div className='flex justify-between items-center gap-3 mb-3'>
                    <div>
                        <span className='text-light-gray mr-2'>#</span>
                        <span className='text-light-gray'>Title</span>
                    </div>
                    {/* <div>
                        <img src={clock} />
                    </div> */}
                </div>
                <hr />
                <div className='flex-col mt-5'>
                    {playlist?.tracks?.items.map((track, index) =>
                        <div className='flex justify-between items-center hover:bg-light-gray-hover p-2 rounded-lg'>
                                <div className='flex justify-end items-center gap-3'>
                                        <p className='text-sm font-medium'>{index + 1}</p>
                                           <img src={track?.track?.album?.images[2]?.url}/> 
                                           <h6 className='text-sm font-medium hover:underline'>{track?.track?.name}</h6>
                                        <p className='text-sm font-normal hover:underline'>{track?.track?.album.name}</p>
                                        <p>{track?.added_at}</p>
                                        <p>{millisToMinutesAndSeconds(track?.track?.duration_ms)}</p>
                                </div>
                                {/* {track?.track.map(song => <span className='text-light-gray font-medium hover:underline'>{song?.name}</span>)} */}
                        </div>)}
                </div>

            </div>
        </Container>
    )
}
