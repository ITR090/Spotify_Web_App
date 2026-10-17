import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// context
import { PlayerContext } from '../store/PlayerStore'
// utils
import { millisToMinutesAndSeconds } from '../utilities/helpers'
// icons
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX, Music, X } from 'lucide-react'

// "spotify:artist:123" -> "123"
const idFromUri = (uri) => uri?.split(':').pop()

// thin Spotify-style slider: white track that turns green on hover
const Slider = ({ value, max, onChange, label, className = '' }) => {
    const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0
    return (
        <div className={`group relative flex items-center h-4 ${className}`}>
            <div className='absolute inset-x-0 h-1 rounded-full bg-white/30 overflow-hidden'>
                <div className='h-full bg-white group-hover:bg-sp-green rounded-full' style={{ width: `${percent}%` }} />
            </div>
            <div className='absolute w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 -translate-x-1/2 pointer-events-none' style={{ left: `${percent}%` }} />
            <input
                type='range'
                min={0}
                max={max || 0}
                step='any'
                value={Math.min(value, max || 0)}
                onChange={(e) => onChange(Number(e.target.value))}
                aria-label={label}
                disabled={!max}
                className='absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-default'
            />
        </div>
    )
}

const CONTROL = 'flex items-center justify-center text-sp-subdued hover:text-white disabled:opacity-40 disabled:hover:text-sp-subdued transition-colors cursor-pointer disabled:cursor-default'

export default function PlayerBar() {

    const navigate = useNavigate()
    const {
        ready, error, currentTrack, paused, position, duration, volume,
        togglePlay, nextTrack, previousTrack, seek, setVolume, clearError,
    } = useContext(PlayerContext)

    // remembered so the mute button can restore the previous volume
    const [lastVolume, setLastVolume] = useState(0.5)

    const hasTrack = Boolean(currentTrack)
    const image = currentTrack?.album?.images?.[currentTrack?.album?.images?.length - 1]?.url ?? currentTrack?.album?.images?.[0]?.url
    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.34 ? Volume : volume < 0.67 ? Volume1 : Volume2

    const toggleMute = () => {
        if (volume > 0) { setLastVolume(volume); setVolume(0) }
        else setVolume(lastVolume || 0.5)
    }

    // same logic as the "token expired" dialog: drop the old token and log in again
    const onClickLogin = () => {
        localStorage.removeItem("userToken")
        navigate('/login')
    }

    return (
        <div className='relative h-[72px] shrink-0 grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center gap-4 px-4 bg-black'>

            {/* error banner (premium required, re-login needed, ...) */}
            {error &&
                <div role='alert' className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 flex items-center gap-3 max-w-[calc(100%-2rem)] px-4 py-2.5 rounded-md bg-[#3d91f4] text-white text-sm font-medium shadow-xl shadow-black/50 animate-fadeIn'>
                    <span>{error}</span>
                    {error.startsWith('Log in') &&
                        <button type='button' onClick={onClickLogin} className='shrink-0 rounded-full bg-white text-black text-xs font-bold px-3 py-1 hover:scale-105 transition-transform cursor-pointer'>Log in</button>
                    }
                    <button type='button' onClick={clearError} aria-label='Dismiss' className='shrink-0 text-white/80 hover:text-white cursor-pointer'><X size={16} /></button>
                </div>
            }

            {/* now playing */}
            <div className='flex items-center gap-3 min-w-0'>
                {hasTrack
                    ? <img src={image} alt='' className='w-14 h-14 rounded object-cover shrink-0' />
                    : <div className='w-14 h-14 rounded bg-sp-highlight text-sp-subdued flex items-center justify-center shrink-0'><Music size={22} /></div>
                }
                <div className='min-w-0'>
                    {hasTrack
                        ? <>
                            <Link to={`/album/${idFromUri(currentTrack?.album?.uri)}`} className='block text-sm text-white font-medium truncate hover:underline'>{currentTrack?.name}</Link>
                            <p className='text-xs text-sp-subdued truncate'>
                                {currentTrack?.artists?.map((artist, i) =>
                                    <span key={artist.uri}>{i > 0 && ', '}<Link to={`/artist/${idFromUri(artist.uri)}`} className='hover:underline hover:text-white'>{artist.name}</Link></span>
                                )}
                            </p>
                        </>
                        : <p className='text-sm text-sp-subdued truncate'>{ready ? 'Pick a song to start listening' : 'Connecting to Spotify…'}</p>
                    }
                </div>
            </div>

            {/* controls + progress */}
            <div className='flex flex-col items-center gap-1 min-w-0'>
                <div className='flex items-center gap-5'>
                    <button type='button' onClick={previousTrack} disabled={!hasTrack} aria-label='Previous' className={`${CONTROL} hidden sm:flex`}>
                        <SkipBack size={18} fill='currentColor' />
                    </button>
                    <button type='button' onClick={togglePlay} disabled={!hasTrack} aria-label={paused ? 'Play' : 'Pause'} className='w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-transform cursor-pointer disabled:cursor-default'>
                        {paused ? <Play size={16} fill='currentColor' strokeWidth={0} className='ml-0.5' /> : <Pause size={16} fill='currentColor' strokeWidth={0} />}
                    </button>
                    <button type='button' onClick={nextTrack} disabled={!hasTrack} aria-label='Next' className={`${CONTROL} hidden sm:flex`}>
                        <SkipForward size={18} fill='currentColor' />
                    </button>
                </div>
                <div className='hidden md:flex items-center gap-2 w-full max-w-xl text-[11px] text-sp-subdued tabular-nums'>
                    <span className='w-10 text-right'>{millisToMinutesAndSeconds(position)}</span>
                    <Slider value={position} max={duration} onChange={seek} label='Seek' className='flex-1' />
                    <span className='w-10'>{millisToMinutesAndSeconds(duration)}</span>
                </div>
            </div>

            {/* volume */}
            <div className='hidden md:flex items-center justify-end gap-2'>
                <button type='button' onClick={toggleMute} aria-label={volume === 0 ? 'Unmute' : 'Mute'} className={CONTROL}>
                    <VolumeIcon size={18} />
                </button>
                <Slider value={volume} max={1} onChange={setVolume} label='Volume' className='w-24' />
            </div>

            {/* thin progress line on small screens (Spotify mobile style) */}
            {hasTrack &&
                <div className='md:hidden absolute left-4 right-4 bottom-1 h-0.5 rounded-full bg-white/20 overflow-hidden'>
                    <div className='h-full bg-white' style={{ width: `${duration ? (position / duration) * 100 : 0}%` }} />
                </div>
            }
        </div>
    )
}
