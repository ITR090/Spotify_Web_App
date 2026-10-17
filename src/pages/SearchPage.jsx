import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
import Modal from '../UI/Modal'
import { PlaybackButton } from '../UI/Buttons/PlayButton'
import Slider from '../components/Slider'
// Hooks
import useFetch from '../hooks/useFetch'
// Import Swiper React components
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
// utils
import { millisToMinutesAndSeconds } from '../utilities/helpers'
// icons
import { Music, Search as SearchIcon, User } from 'lucide-react'


// image with a fallback icon when Spotify returns no artwork
const Artwork = ({ src, round, className = '', iconSize = 48, Icon = Music }) => src
    ? <img src={src} alt='' className={`object-cover shadow-lg shadow-black/50 ${round ? 'rounded-full' : 'rounded-md'} ${className}`} />
    : <div className={`flex items-center justify-center bg-sp-highlight text-sp-subdued shadow-lg shadow-black/50 ${round ? 'rounded-full' : 'rounded-md'} ${className}`}><Icon size={iconSize} /></div>

const artistNames = (artists) => artists?.map(artist => artist?.name).join(', ')

const TopResult = ({ artist, track }) => {
    const navigate = useNavigate()
    const item = artist ?? track
    if (!item) return null
    const isArtist = Boolean(artist)
    const image = isArtist ? artist?.images?.[0]?.url : track?.album?.images?.[0]?.url

    return (
        <div onClick={() => navigate(isArtist ? `/artist/${item.id}` : `/track/${item.id}`)} className='group relative h-full min-h-56 p-5 rounded-lg bg-sp-elevated hover:bg-sp-highlight transition-colors cursor-pointer'>
            <Artwork src={image} round={isArtist} className='w-24 h-24' Icon={isArtist ? User : Music} />
            <h3 className='mt-5 text-3xl font-black tracking-tight truncate'>{item.name}</h3>
            <p className='mt-1 text-sm text-sp-subdued truncate'>
                {!isArtist && <span className='text-white/90'>{artistNames(track?.artists)}</span>}
                <span className={`${!isArtist ? 'ml-2 ' : ''}inline-block rounded-full bg-black/40 text-white text-xs font-bold px-3 py-1`}>{isArtist ? 'Artist' : 'Song'}</span>
            </p>
            <PlaybackButton size={48} className='sp-card-play absolute bottom-5 right-5' label={`Play ${item.name}`} matchUri={item.uri} options={isArtist ? { contextUri: item.uri } : { uris: [item.uri] }} />
        </div>
    )
}

const SongRow = ({ track }) => (
    <Link to={`/track/${track?.id}`} className='group grid grid-cols-[1fr_auto] gap-4 items-center px-2 py-1.5 rounded-md hover:bg-sp-tinted-hover transition-colors'>
        <div className='flex items-center gap-3 min-w-0'>
            <Artwork src={track?.album?.images?.[2]?.url ?? track?.album?.images?.[0]?.url} className='w-10 h-10 rounded-sm! shrink-0 shadow-none!' iconSize={18} />
            <div className='min-w-0'>
                <p className='text-white font-medium truncate'>{track?.name}</p>
                <p className='text-sm text-sp-subdued truncate'>{artistNames(track?.artists)}</p>
            </div>
        </div>
        <span className='text-sm text-sp-subdued tabular-nums'>{millisToMinutesAndSeconds(track?.duration_ms)}</span>
    </Link>
)

const CardRow = ({ title, items, renderCard }) => items?.length > 0 && (
    <>
        <h5 className='sp-section-title'>{title}</h5>
        <Slider>
            {items.map(item =>
                <SwiperSlide key={item.id} style={{ width: 'auto', height: 'auto' }}>
                    {renderCard(item)}
                </SwiperSlide>
            )}
        </Slider>
    </>
)

function SearchResults({ query }) {

    const { data: results, errors } = useFetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&market=US&limit=10`)

    if (errors?.response?.status === 401 || errors === 'Unauthorized please login') {
        return <Modal type='token-expired' open={true} />
    }

    if (errors) {
        return <p className='py-16 text-center text-sp-subdued'>Something went wrong while searching. Please try again.</p>
    }

    if (!results) {
        return (
            <div className='flex justify-center py-16'>
                <span className='loading loading-spinner loading-lg text-sp-subdued'></span>
            </div>
        )
    }

    // Spotify can return null entries (e.g. removed playlists)
    const tracks = results?.tracks?.items?.filter(Boolean) ?? []
    const artists = results?.artists?.items?.filter(Boolean) ?? []
    const albums = results?.albums?.items?.filter(Boolean) ?? []
    const playlists = results?.playlists?.items?.filter(Boolean) ?? []

    if (!tracks.length && !artists.length && !albums.length && !playlists.length) {
        return (
            <div className='py-16 text-center'>
                <h3 className='text-2xl font-bold'>No results found for "{query}"</h3>
                <p className='mt-2 text-sp-subdued'>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
            </div>
        )
    }

    return (
        <>
            {(artists[0] || tracks[0]) &&
                <div className='grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6'>
                    <div>
                        <h5 className='sp-section-title mt-2!'>Top result</h5>
                        <TopResult artist={artists[0]} track={artists[0] ? undefined : tracks[0]} />
                    </div>
                    {tracks.length > 0 &&
                        <div className='min-w-0'>
                            <h5 className='sp-section-title mt-2!'>Songs</h5>
                            <div className='flex flex-col'>
                                {tracks.slice(0, 4).map(track => <SongRow key={track.id} track={track} />)}
                            </div>
                        </div>
                    }
                </div>
            }

            <CardRow title='Artists' items={artists} renderCard={artist =>
                <Link to={`/artist/${artist.id}`} className='sp-card group w-44'>
                    <div className='relative'>
                        <Artwork src={artist?.images?.[1]?.url ?? artist?.images?.[0]?.url} round className='w-40 h-40' Icon={User} />
                        <PlaybackButton size={48} className='sp-card-play absolute bottom-1 right-1' label={`Play ${artist.name}`} matchUri={artist.uri} options={{ contextUri: artist.uri }} />
                    </div>
                    <h5 className='mt-3 text-white font-semibold truncate'>{artist.name}</h5>
                    <p className='text-sm text-sp-subdued'>Artist</p>
                </Link>
            } />

            <CardRow title='Albums' items={albums} renderCard={album =>
                <Link to={`/album/${album.id}`} className='sp-card group w-48'>
                    <div className='relative'>
                        <Artwork src={album?.images?.[0]?.url} className='w-44 h-44' />
                        <PlaybackButton size={48} className='sp-card-play absolute bottom-2 right-2' label={`Play ${album.name}`} matchUri={album.uri} options={{ contextUri: album.uri }} />
                    </div>
                    <h5 className='mt-3 text-white font-semibold line-clamp-1'>{album.name}</h5>
                    <p className='text-sm text-sp-subdued line-clamp-1'>{album?.release_date?.slice(0, 4)} • {artistNames(album?.artists)}</p>
                </Link>
            } />

            <CardRow title='Playlists' items={playlists} renderCard={playlist =>
                <Link to={`/playlist/${playlist.id}`} className='sp-card group w-48'>
                    <div className='relative'>
                        <Artwork src={playlist?.images?.[0]?.url} className='w-44 h-44' />
                        <PlaybackButton size={48} className='sp-card-play absolute bottom-2 right-2' label={`Play ${playlist.name}`} matchUri={playlist.uri} options={{ contextUri: playlist.uri }} />
                    </div>
                    <h5 className='mt-3 text-white font-semibold line-clamp-1'>{playlist.name}</h5>
                    <p className='text-sm text-sp-subdued line-clamp-1'>By {playlist?.owner?.display_name}</p>
                </Link>
            } />

            <div className='h-8' />
        </>
    )
}

export default function SearchPage() {

    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')?.trim() ?? ''

    return (
        <Container>
            {query
                // keyed by query so each search starts from a clean state
                ? <SearchResults key={query} query={query} />
                : (
                    <div className='flex flex-col items-center justify-center text-center py-24'>
                        <SearchIcon size={56} className='text-sp-subdued' />
                        <h3 className='mt-6 text-2xl font-bold'>Search Spotify</h3>
                        <p className='mt-2 text-sp-subdued'>Find your favourite songs, artists, albums and playlists.</p>
                    </div>
                )
            }
        </Container>
    )
}
