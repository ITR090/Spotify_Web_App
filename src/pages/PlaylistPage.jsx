import React, {useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// Hooks
import useFetch from '../hooks/useFetch'
// context
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import Container from '../UI/Container'
import Modal from '../UI/Modal'
import { PlaybackButton } from '../UI/Buttons/PlayButton'
// playback
import { usePlayback } from '../store/PlayerStore'
// Utils
import { formatDate,millisToMinutesAndSeconds } from '../utilities/helpers'
// icon
import { Music, Clock3, Ellipsis, Trash2, Play, Pause, Pencil } from 'lucide-react'

// Spotify returns descriptions HTML-escaped (e.g. "it&#x27;s") — decode to plain text
const decodeHtml = (text) => {
    if (!text) return ''
    return new DOMParser().parseFromString(text, 'text/html').documentElement.textContent ?? ''
}

// one song in the playlist — click to play the playlist from this song
function PlaylistRow({ track, index, playlistUri }) {
    const { isCurrent, isPlaying, onPlay } = usePlayback(track?.uri,
        playlistUri ? { contextUri: playlistUri, offsetUri: track?.uri } : { uris: [track?.uri] })

    return (
        <div onClick={onPlay} role='button' tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onPlay(e) }} aria-label={`${isPlaying ? 'Pause' : 'Play'} ${track?.name}`} className={`group grid grid-cols-[2rem_minmax(0,6fr)_auto] md:grid-cols-[2rem_minmax(0,5fr)_minmax(0,4fr)_auto] gap-4 items-center px-4 py-2 hover:bg-sp-tinted-hover rounded-md transition-colors cursor-pointer ${isCurrent ? 'bg-sp-tinted' : ''}`}>
            <div className={`flex justify-end tabular-nums ${isCurrent ? 'text-sp-green' : 'text-sp-subdued'}`}>
                <span className='group-hover:hidden'>{index + 1}</span>
                <span className='hidden group-hover:block text-white'>
                    {isPlaying ? <Pause size={14} fill='currentColor' /> : <Play size={14} fill='currentColor' />}
                </span>
            </div>
            <div className='flex items-center gap-3 min-w-0'>
                <img className='w-10 h-10 rounded-sm object-cover shrink-0' src={track?.album?.images?.[2]?.url ?? track?.album?.images?.[0]?.url} />
                <div className='min-w-0'>
                    <p className={`font-medium truncate ${isCurrent ? 'text-sp-green' : 'text-white'}`}>{track?.name}</p>
                    <p className='text-sm text-sp-subdued truncate'>{track?.artists?.map(artist => artist?.name).join(', ')}</p>
                </div>
            </div>
            <p className='hidden md:block text-sm text-sp-subdued truncate'>{track?.album?.name}</p>
            <p className='text-sm text-sp-subdued text-right pr-2 tabular-nums'>{millisToMinutesAndSeconds(track?.duration_ms)}</p>
        </div>
    )
}

export default function PlaylistPage() {

    const params = useParams()
    const navigate = useNavigate()
    const { data: playlist, setFetchedData: setPlaylistData, errors: playlistErrors } = useFetch(`https://api.spotify.com/v1/playlists/${params.id}?market=SA`, params.id)

    const { deletePlayList, updatePlayList, getUserDetails } = useContext(SpotifyContext)
    const [deleteModalState, setDeleteModalState] = useState(false)
    const [editModalState, setEditModalState] = useState(false)

    // only the owner can edit or delete a playlist
    const isOwner = Boolean(playlist && playlist?.owner?.id === getUserDetails()?.id)

    const coverUrl = playlist?.images?.[1]?.url ?? playlist?.images?.[0]?.url
    const description = decodeHtml(playlist?.description)

    const onClickEdit = () => {
        // close the daisyUI focus-based dropdown
        document.activeElement?.blur()
        setEditModalState(true)
    }

    // called by the "Edit details" Save button; sends only what changed, returns true on success
    const onSaveDetails = async (name, newDescription) => {
        const details = {}
        if (name !== playlist?.name) details.name = name
        if (newDescription !== description) details.description = newDescription
        if (Object.keys(details).length === 0) return true

        const saved = await updatePlayList(playlist?.id, details)
        if (saved) {
            // update this page right away
            setPlaylistData(current => current && { ...current, ...details })
            setEditModalState(false)
        }
        return saved
    }

    const onClickDelete = () => {
        // close the daisyUI focus-based dropdown
        document.activeElement?.blur()
        setDeleteModalState(true)
    }

    // called by the dialog's Delete button; returns true on success
    const onConfirmDelete = async () => {
        const deleted = await deletePlayList(playlist?.id)
        if (deleted) {
            setDeleteModalState(false)
            navigate('/')
        }
        return deleted
    }

    if (playlistErrors) {
        return <Modal type='token-expired' open={true} />
    }

    // Feb 2026: playlist `tracks` -> `items` and each entry's `track` -> `item`.
    // Read the new shape first and fall back to the old one.
    const playlistItems = playlist?.items ?? playlist?.tracks
    const entries = playlistItems?.items ?? []
    const totalSongs = playlistItems?.total

    let userPlayList = entries.length > 0

    // user has playlist
    const DisplayUserPlayList = () => {
        return (
        <div>
            <div className='text-sp-subdued text-sm font-normal'>
                <div className="grid grid-cols-[2rem_minmax(0,6fr)_auto] md:grid-cols-[2rem_minmax(0,5fr)_minmax(0,4fr)_auto] gap-4 items-center px-4 pb-2 mb-2 border-b border-white/10">
                    <div className="text-right">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Album</div>
                    <div className="flex justify-end pr-2"><Clock3 size={16} /></div>
                </div>
            </div>
            <div className='mb-6'>
                {entries.map((entry, index) =>
                    <PlaylistRow key={index + 1} track={entry?.item ?? entry?.track} index={index} playlistUri={playlist?.uri} />)}
            </div>
        </div>)
    }


    return (
        <Container>
            {/* hero */}
            <div className='sp-hero -mx-4 md:-mx-6 -mt-6 px-4 md:px-6 pt-10 pb-6 flex flex-col md:flex-row gap-6 md:items-end'>
                {/* cover — owners can click it to edit details (like Spotify) */}
                <div
                    onClick={isOwner ? onClickEdit : undefined}
                    role={isOwner ? 'button' : undefined}
                    tabIndex={isOwner ? 0 : undefined}
                    onKeyDown={isOwner ? (e) => { if (e.key === 'Enter') onClickEdit() } : undefined}
                    aria-label={isOwner ? 'Edit details' : undefined}
                    className={`group relative w-48 h-48 lg:w-58 lg:h-58 shrink-0 self-center md:self-auto rounded shadow-2xl shadow-black/60 overflow-hidden ${isOwner ? 'cursor-pointer' : ''}`}
                >
                    {coverUrl
                        ? <img src={coverUrl} alt='' className='w-full h-full object-cover' />
                        : <div className='w-full h-full bg-sp-highlight flex items-center justify-center text-sp-subdued'><Music size={72}/></div>
                    }
                    {isOwner &&
                        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity'>
                            <Pencil size={44} />
                            <span className='text-sm font-semibold'>Edit details</span>
                        </div>
                    }
                </div>
                <div className='min-w-0'>
                    <p className='text-sm font-medium capitalize'>{playlist?.type}</p>
                    {isOwner
                        ? <h2 onClick={onClickEdit} title='Edit details' className='font-black tracking-tight text-4xl md:text-5xl lg:text-7xl leading-tight my-2 wrap-break-word cursor-pointer'>{playlist?.name}</h2>
                        : <h2 className='font-black tracking-tight text-4xl md:text-5xl lg:text-7xl leading-tight my-2 wrap-break-word'>{playlist?.name}</h2>
                    }
                    {description && <p className='text-sm text-sp-subdued mb-2 line-clamp-2'>{description}</p>}
                    <p className='text-sm'>
                        <span className='font-bold'>{playlist?.owner?.display_name}</span>
                        {totalSongs != null && <span className='text-sp-subdued'>{` • ${totalSongs} songs`}</span>}
                    </p>
                </div>
            </div>

            {/* action bar */}
            <div className='py-6 flex items-center gap-6'>
                <PlaybackButton size={56} label={`Play ${playlist?.name ?? 'playlist'}`} matchUri={playlist?.uri} options={{ contextUri: playlist?.uri }} />
                {isOwner &&
                    <div className="dropdown dropdown-start">
                        <div tabIndex={0} role="button" aria-label={`More options for ${playlist?.name}`} className='text-sp-subdued hover:text-white hover:scale-105 transition-all cursor-pointer'>
                            <Ellipsis size={32} />
                        </div>
                        <ul tabIndex="-1" className="dropdown-content menu bg-sp-highlight text-white w-56 rounded-md z-10 p-1 mt-2 shadow-xl shadow-black/50">
                            <li onClick={onClickEdit}>
                                <a className='flex items-center gap-3 rounded-sm px-3 py-2.5 hover:bg-white/10'>
                                    <Pencil size={16} className='text-sp-subdued' />
                                    Edit details
                                </a>
                            </li>
                            <li onClick={onClickDelete}>
                                <a className='flex items-center gap-3 rounded-sm px-3 py-2.5 hover:bg-white/10'>
                                    <Trash2 size={16} className='text-sp-subdued' />
                                    Delete
                                </a>
                            </li>
                        </ul>
                    </div>
                }
            </div>

            {/* traks */}
            {userPlayList && <DisplayUserPlayList />}
            {!userPlayList && playlist && (isOwner || playlistItems) && (
                <div className='py-10 text-center'>
                    <h3 className='text-2xl font-bold'>Let's find something for your playlist</h3>
                    <p className='text-sp-subdued mt-2'>This playlist doesn't have any songs yet.</p>
                </div>
            )}
            {/* Spotify only returns the song list for playlists you own or collaborate on */}
            {!userPlayList && playlist && !isOwner && !playlistItems && (
                <p className='py-10 text-center text-sp-subdued'>Press play to listen to this playlist. Spotify only shows the song list for playlists you own.</p>
            )}

            <Modal type='edit-playlist' open={editModalState} onClose={setEditModalState} onClick={onSaveDetails}
                defaultName={playlist?.name ?? ''} defaultDescription={description} image={coverUrl} />
            <Modal type='delete-playlist' open={deleteModalState} onClose={setDeleteModalState} onClick={onConfirmDelete} playlistName={playlist?.name} />
        </Container>
    )
}
