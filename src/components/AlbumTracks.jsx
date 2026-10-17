import React, { useState,useContext, useEffect } from 'react'
// lib
import { millisToMinutesAndSeconds } from '../utilities/helpers'
// icons
import { Play, Pause } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { SpotifyContext } from '../store/SpotifyStore'
import { usePlayback } from '../store/PlayerStore'

// one album track row — `album` is the track object; `albumUri` is the album it belongs to
const AlbumTracks = ({ album, albumUri }) => {

    const {addTrackToPlaylist, playlists, getUserDetails} = useContext(SpotifyContext);
    const [isHovering, setIsHovering] = useState(false);
    // play the album from this track, so next/previous follow the album order
    const { isCurrent, isPlaying, onPlay } = usePlayback(album?.uri,
        albumUri ? { contextUri: albumUri, offsetUri: album?.uri } : { uris: [album?.uri] })
    // { text, ok } feedback shown after adding to a playlist
    const [toast, setToast] = useState(null);

    const userId = getUserDetails()?.id
    // Spotify only lets users add tracks to playlists they own (or collaborative ones)
    const editablePlaylists = playlists?.items?.filter(
        playlist => playlist?.owner?.id === userId || playlist?.collaborative
    ) ?? []

    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 2500)
        return () => clearTimeout(timer)
    }, [toast])

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const onClickAddToPlaylist = async (playlist) => {
        // close the daisyUI focus-based dropdown
        document.activeElement?.blur()
        const added = await addTrackToPlaylist(playlist.id, album?.uri)
        setToast(added
            ? { text: `Added to ${playlist.name}`, ok: true }
            : { text: "Couldn't add to playlist", ok: false })
    }

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onPlay} role='button' tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' && e.target === e.currentTarget) onPlay(e) }} aria-label={`${isPlaying ? 'Pause' : 'Play'} ${album?.name}`} key={album?.id} className={`group grid grid-cols-[2rem_1fr_auto] gap-4 items-center px-4 py-2 rounded-md hover:bg-sp-tinted-hover transition-colors cursor-pointer ${isCurrent ? 'bg-sp-tinted' : ''}`}>
            <div className={`flex justify-end ${isCurrent ? 'text-sp-green' : 'text-sp-subdued'}`}>
                {isHovering && (isPlaying
                    ? <Pause size={14} fill='currentColor' className='text-white' />
                    : <Play size={14} fill='currentColor' className='text-white' />)}
                {!isHovering && <p className='font-medium tabular-nums'>{album?.track_number}</p>}
            </div>
            <div className='min-w-0'>
                <h6 className={`font-medium truncate ${isCurrent ? 'text-sp-green' : 'text-white'}`}>{album?.name}</h6>
                <p className='text-sm text-sp-subdued truncate'>
                    {album?.artists.map((artist, i) => <span key={artist?.id}>{i > 0 && ', '}<span className='hover:underline hover:text-white cursor-pointer'>{artist?.name}</span></span>)}
                </p>
            </div>

            <div className='flex items-center gap-4 text-sm text-sp-subdued'>
                <p className='font-medium tabular-nums'>{millisToMinutesAndSeconds(album?.duration_ms)}</p>
                {/* the menu must not start playback */}
                <div className="dropdown dropdown-top dropdown-end" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <div tabIndex={0} role="button" aria-label='More options' className='opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-white cursor-pointer'><Ellipsis size={18}/></div>
                    <ul tabIndex="-1" className="dropdown-content menu flex-nowrap bg-sp-highlight text-white w-64 max-h-72 overflow-y-auto sp-scroll rounded-md z-10 p-1 shadow-xl shadow-black/50">
                        <li className='menu-title text-xs text-sp-subdued px-3 pt-2 pb-1'>Add to playlist</li>
                        {editablePlaylists.length === 0 && <li className='px-3 py-2 text-sp-subdued'>You don't have any playlists yet</li>}
                        {editablePlaylists.map(playlist =>
                            <li key={playlist.id} onClick={() => onClickAddToPlaylist(playlist)}>
                                <a className='rounded-sm px-3 py-2 hover:bg-white/10 truncate block'>{playlist.name}</a>
                            </li>
                        )}
                    </ul>
                </div>

            </div>

            {toast &&
                <div role='status' className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-md text-sm font-medium shadow-xl shadow-black/50 animate-fadeIn ${toast.ok ? 'bg-[#3d91f4] text-white' : 'bg-[#e91429] text-white'}`}>
                    {toast.text}
                </div>
            }
        </div>
    )
}

export default AlbumTracks;
