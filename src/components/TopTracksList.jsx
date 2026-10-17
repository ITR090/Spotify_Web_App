import React, { useState } from "react"
// icon
import { Play, Pause } from 'lucide-react';
// utils
import { millisToMinutesAndSeconds } from '../utilities/helpers'
// playback
import { usePlayback } from '../store/PlayerStore'

// artist's tracks — click a row to play it
// playOptions: what to send to the player (e.g. this track + the ones after it)
const TopTracksList = ({ track, index, playOptions }) => {

    const [isHovering, setIsHovering] = useState(false);
    const { isCurrent, isPlaying, onPlay } = usePlayback(track?.uri, playOptions ?? { uris: [track?.uri] })

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onPlay} role='button' tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onPlay(e) }} aria-label={`${isPlaying ? 'Pause' : 'Play'} ${track?.name}`} key={track?.id} className={`grid grid-cols-[2rem_1fr_auto] gap-4 items-center px-4 py-2 rounded-md hover:bg-sp-tinted-hover transition-colors cursor-pointer ${isCurrent ? 'bg-sp-tinted' : ''}`}>
            <div className={`flex justify-end tabular-nums ${isCurrent ? 'text-sp-green' : 'text-sp-subdued'}`}>
                {isHovering
                    ? (isPlaying ? <Pause size={14} fill='currentColor' className='text-white' /> : <Play size={14} fill='currentColor' className='text-white' />)
                    : (index ?? 0) + 1}
            </div>
            <div className='flex items-center gap-3 min-w-0'>
                {track?.album?.images?.[2]?.url && <img src={track?.album?.images?.[2]?.url} className='w-10 h-10 rounded-sm object-cover shrink-0' alt='' />}
                <div className='min-w-0'>
                    <h6 className={`font-medium truncate ${isCurrent ? 'text-sp-green' : 'text-white'}`}>{track?.name}</h6>
                    <p className='text-sm text-sp-subdued truncate'>{track?.artists?.map(artist => artist?.name).join(', ')}</p>
                </div>
            </div>
            <div className='text-sm text-sp-subdued font-medium tabular-nums'>{millisToMinutesAndSeconds(track?.duration_ms)}</div>
        </div>
    )
}

export default TopTracksList
