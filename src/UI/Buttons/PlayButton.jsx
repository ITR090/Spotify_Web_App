import React from 'react'
import { Play, Pause } from 'lucide-react'
import { usePlayback } from '../../store/PlayerStore'

// PlayButton wired to the player — use inside lists/cards.
// matchUri: the item this button represents; options: what to play (see PlayerStore.playTrack)
export function PlaybackButton({ matchUri, options, ...props }) {
    const { isPlaying, onPlay } = usePlayback(matchUri, options)
    return <PlayButton {...props} onClick={matchUri ? onPlay : undefined} isPlaying={isPlaying} />
}

// Spotify's round green play button. Pass onClick to make it play something;
// isPlaying switches the icon to pause.
export default function PlayButton({ size = 56, className = '', onClick, isPlaying = false, label = 'Play' }) {
    const Icon = isPlaying ? Pause : Play
    return (
        <div
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? (isPlaying ? 'Pause' : label) : undefined}
            onClick={onClick}
            onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e) } : undefined}
            className={`flex items-center justify-center rounded-full bg-sp-green text-black shadow-lg shadow-black/40 transition-transform duration-150 hover:scale-105 hover:bg-sp-green-hover cursor-pointer ${isPlaying ? 'opacity-100! translate-y-0!' : ''} ${className}`}
            style={{ width: size, height: size }}
        >
            <Icon size={size * 0.42} fill='currentColor' strokeWidth={0} className={isPlaying ? '' : 'ml-0.5'} />
        </div>
    )
}
