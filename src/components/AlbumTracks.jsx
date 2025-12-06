import React, { useState,useContext } from 'react'
// lib
import { millisToMinutesAndSeconds } from '../utilities/helpers'
// icons
import { Play } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { SpotifyContext } from '../store/SpotifyStore'

const AlbumTracks = ({ album }) => {

    const {addTrackToPlaylist} = useContext(SpotifyContext);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const onClickAddToPlaylist =()=>{
        addTrackToPlaylist('id')
    }

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} key={album?.id} className='flex justify-between items-center p-1 hover:bg-gray-700 rounded-lg'>
            <div>
                <div className='flex items-center gap-3'>
                    {isHovering && <Play size={16} />}
                    {!isHovering && <p className='font-medium'>{album?.track_number}</p>}
                    <h6 className='font-medium hover:underline'>{album?.name}</h6>
                </div>
                {album?.artists.map(artist => <span key={artist?.id} className='font-medium hover:underline'>{artist?.name}</span>)}
            </div>

            <div className='flex gap-2'>
                <p className='font-medium'>{millisToMinutesAndSeconds(album?.duration_ms)}</p>
                <div className="dropdown dropdown-top dropdown-end">
                    <div tabIndex={0} role="button"><Ellipsis/></div>
                    <ul tabIndex="-1" className="dropdown-content menu bg-gray-700 w-60 rounded-box z-1 p-2 shadow-sm">
                        <li onClick={()=>addTrackToPlaylist()}>Add to playlist</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default AlbumTracks;