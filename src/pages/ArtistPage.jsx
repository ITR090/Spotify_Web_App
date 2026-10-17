import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
// UI
import Container from '../UI/Container'
// Hooks
import useFetch from '../hooks/useFetch'
// UI
import Slider from '../components/Slider'
import SecondaryButton from '../UI/Buttons/SecondaryButton'
import PlayButton from '../UI/Buttons/PlayButton'
import Modal from '../UI/Modal'
// Import Swiper React components
import { SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// Components
import TopTracksList from '../components/TopTracksList'
// playback
import { usePlayback } from '../store/PlayerStore'


// The artist's songs.
// GET /artists/{id}/top-tracks was removed by Spotify (Feb 2026) with no replacement,
// so we search for tracks by this artist (GET /search, max 10 results) and keep
// only the ones the artist is actually credited on.
function ArtistSongs({ artist }) {

    const { data: results } = useFetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(`artist:"${artist.name}"`)}&type=track&market=US&limit=10`)

    const tracks = results?.tracks?.items
        ?.filter(track => track?.artists?.some(a => a.id === artist.id)) ?? []

    if (!results) {
        return <div className='flex justify-center py-8'><span className='loading loading-spinner text-sp-subdued'></span></div>
    }

    if (!tracks.length) {
        return <p className='text-sp-subdued py-4'>No songs found for this artist.</p>
    }

    return (
        <div className='flex flex-col'>
            {/* clicking a song plays it and then continues with the songs below it */}
            {tracks.map((track, index) =>
                <TopTracksList key={track.id} track={track} index={index} playOptions={{ uris: tracks.slice(index).map(t => t.uri) }} />
            )}
        </div>
    )
}

function AlbumCard({ albmu }) {
    const { isPlaying, onPlay } = usePlayback(albmu?.uri, { contextUri: albmu?.uri })
    return (
        <Link to={`/album/${albmu.id}`}>
            <div className='sp-card group w-48'>
                <div className='relative'>
                    <img src={albmu?.images[0].url} className='rounded-md w-44 h-44 object-cover shadow-lg shadow-black/50' />
                    <PlayButton size={48} className='sp-card-play absolute bottom-2 right-2' onClick={onPlay} isPlaying={isPlaying} label={`Play ${albmu.name}`} />
                </div>
                <h5 className='mt-3 text-white font-semibold line-clamp-1'>{albmu.name}</h5>
                <p className='text-sm text-sp-subdued'>{albmu?.release_date?.slice(0, 4)} • Album</p>
            </div>
        </Link>
    )
}

export default function ArtistPage() {

    const params = useParams()
    const { data: artist, errors: errorsArtist } = useFetch(`https://api.spotify.com/v1/artists/${params.id}`, params.id)
    const { data: albmus, errors: albmusErrors } = useFetch(`https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=album&market=US`, params.id)

    // the big green button plays the artist (Spotify picks the artist's top songs)
    const { isPlaying: artistPlaying, onPlay: onPlayArtist } = usePlayback(artist?.uri, { contextUri: artist?.uri })


    if (errorsArtist && albmusErrors) {
        return <Modal type='token-expired' open={true} />
    }

    return (
        <Container>
            {/* hero banner */}
            <div className='relative -mx-4 md:-mx-6 -mt-6 h-72 md:h-96 overflow-hidden'>
                <img src={artist?.images[0]?.url} className='absolute inset-0 w-full h-full object-cover object-[center_25%]' />
                {/* Dark Bottom Gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-[#121212]" />
                {/* Text Overlay */}
                <div className="absolute bottom-6 left-4 md:left-6 right-4 text-white">
                    <p className='text-sm font-medium capitalize'>{artist?.type}</p>
                    <h1 className="font-black tracking-tight text-5xl md:text-7xl lg:text-8xl leading-none my-3 drop-shadow-lg truncate">{artist?.name}</h1>
                    {/* `followers` was removed from the artist object (Feb 2026) — only show it if present */}
                    {artist?.followers?.total != null &&
                        <p className="text-base text-white/90">
                            {artist?.followers?.total?.toLocaleString('en-US')} followers
                        </p>
                    }
                </div>
            </div>

            {/* action bar */}
            <div className='py-6 flex items-center gap-5'>
                <PlayButton size={56} onClick={artist ? onPlayArtist : undefined} isPlaying={artistPlaying} label={`Play ${artist?.name ?? 'artist'}`} />
            </div>

            {/* songs */}
            <div>
                <h3 className='text-2xl font-bold mb-4'>Songs</h3>
                {artist && <ArtistSongs key={artist.id} artist={artist} />}
            </div>

            {/* discography */}

            <div className='mt-10 mb-6'>
                <h3 className='text-2xl font-bold mb-4'>Discography</h3>
                {/* <SecondaryButton type="button">Albums</SecondaryButton>
                <SecondaryButton type="button">Singles and EPs</SecondaryButton> */}

                <div>
                    <Slider>
                        {albmus && albmus.items.map((albmu => <SwiperSlide key={albmu.id} style={{ width: 'auto', height: 'auto' }}>
                            <AlbumCard albmu={albmu} />
                        </SwiperSlide>))}
                    </Slider>
                </div>
            </div>

        </Container>
    )
}
