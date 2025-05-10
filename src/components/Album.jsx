import React from 'react'
// icons
import play_button from '../assets/icons/play-button.png'
import checked from '../assets/icons/checked.png'
import clock from '../assets/icons/clock.png'
// utils
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'
import {formatDate} from '../utilities/formatDate'

export default function Album({album}) {
    return (
        <>
            {/* start */}
            <div className='flex gap-5 items-end'>
                <img src={album?.images[1]?.url} alt="" width={260} height={260} />
                <div className='leading-10'>
                    <span className='capitalize'>{album?.album_type}</span>
                    <h2 className='font-bold text-6xl'>{album?.name}</h2>
                    <p className='mt-5'>{`${album?.artists[0]?.name} . ${formatDate(album?.release_date)} . ${album?.total_tracks} songs`}</p>
                </div>
            </div>
            {/* end */}

            {/* start */}
            <div className='mt-10 flex items-center gap-5'>
                <div>
                    <img src={play_button} />
                </div>
                <div>
                    <img src={checked} />
                </div>
            </div>
            {/* end */}

            {/* start */}
            <div className='mt-10'>
                <div className='flex justify-between items-center gap-3 mb-3'>
                    <div>
                        <span className='text-light-gray mr-2'>#</span>
                        <span className='text-light-gray'>Title</span>
                    </div>
                    <div>
                        <img src={clock} />
                    </div>
                </div>
                <hr />
                <div className='flex-col mt-5'>
                    {album?.tracks?.items.map((album, index) =>
                        <div key={album?.id} className='flex justify-between items-center hover:bg-light-gray-hover p-2 rounded-lg'>

                            <div>
                                <div className='flex items-center gap-3'>
                                    <p className='text-xl font-medium'>{index + 1}</p>
                                    <h6 className='text-xl font-medium hover:underline'>{album?.name}</h6>
                                </div>
                                {album?.artists.map(artist => <span className='text-light-gray font-medium hover:underline'>{artist?.name}</span>)}
                            </div>

                            <div>
                                <p className='text-light-gray font-medium'>{millisToMinutesAndSeconds(album?.duration_ms)}</p>
                            </div>

                        </div>)}
                </div>

            </div>
            {/* end */}

            <div className='mt-10'>
                <p className='text-light-gray'>{album?.release_date}</p>
                {album?.copyrights.map(copyright => <p className='text-light-gray'>{copyright.text}</p>)}
            </div>
        </>
    )
}
