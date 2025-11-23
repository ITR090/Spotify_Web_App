import React, { useState } from 'react'
// lib
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'
import { formatDate } from '../utilities/formatDate'
// icon
import { Play } from 'lucide-react';

const AlbumTracks = ({ album }) => {

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };


    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} key={album?.id} className='flex justify-between items-center p-1 hover:bg-gray-700 rounded-lg'>
            <div>
                <div className='flex items-center gap-3'>
                    {isHovering && <Play size={16} />}
                    {!isHovering && <p className='font-medium'>{album?.track_number}</p>}
                    <h6 className='font-medium hover:underline'>{album?.name}</h6>
                </div>
                {album?.artists.map(artist => <span className='font-medium hover:underline'>{artist?.name}</span>)}
            </div>

            <div>
                <p className='font-medium'>{millisToMinutesAndSeconds(album?.duration_ms)}</p>
            </div>
        </div>
    )
}

export default AlbumTracks;