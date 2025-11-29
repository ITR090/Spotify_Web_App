import React, { useState } from "react"
// icon
import { Play } from 'lucide-react';
// utils
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'

// top artist tracks
const TopTracksList = ({ track }) => {

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} key={track?.id} className='flex justify-between items-center p-1 hover:bg-gray-700 rounded-lg'>
            <div className='flex items-center gap-3'>
                {isHovering && <Play size={16} />}
                <h6 className='md:font-medium sm:font-light hover:underline'>{track?.name}</h6>
            </div>
            <div className='text-light-gray font-medium'>{millisToMinutesAndSeconds(track?.duration_ms)}</div>
        </div>
    )
}

export default TopTracksList