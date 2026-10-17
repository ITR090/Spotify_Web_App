import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import Container from '../UI/Container'
import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
import { PlaybackButton } from '../UI/Buttons/PlayButton'
// HOOKS
import useFetch from '../hooks/useFetch'
// Import Swiper React components
import { SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import Modal from '../UI/Modal'
// Icons
import { Plus } from 'lucide-react'
import { Music } from 'lucide-react';
import { AudioLines } from 'lucide-react';


export default function MainPage() {

    // get
    const {playlists, playlistErr} = useContext(SpotifyContext)
    const {topArtists,topArtistsErr} = useContext(SpotifyContext)
    const {topTracks,topTracksErr} = useContext(SpotifyContext)

    const {createPlayList} = useContext(SpotifyContext)
    const {createTopTracksPlayList} = useContext(SpotifyContext)

    const navigate = useNavigate();

    const [createPlayListModalState, setCreatePlayListModalState] = useState(false);

    if (topArtistsErr && topTracksErr && playlistErr) {
        return <Modal type='token-expired' open={true} />
    }

    // open the "Create playlist" dialog so the user can name it
    const onClickCreatePlayList = () => {
        setCreatePlayListModalState(true)
    }

    // called by the dialog's Save button; returns the new playlist (or null on failure)
    const onSaveNewPlayList = async (playlistName) => {
        const newPlaylist = await createPlayList(playlistName)
        if (newPlaylist) {
            setCreatePlayListModalState(false)
            navigate(`/playlist/${newPlaylist.id}`)
        }
        return newPlaylist
    }

    // Spotify-style suggestion, e.g. "My Playlist #4"
    const suggestedPlaylistName = `My Playlist #${Math.max(playlists?.total ?? 0, playlists?.items?.length ?? 0) + 1}`

    const onClickCreateTopPlayList=()=>{
        createTopTracksPlayList("My top tracks")
    }

    return (
        <Container>

            <h5 className='sp-section-title capitalize'>Your favorite artists</h5>
            <Slider>
                {topArtists && topArtists.items?.map((artist) =>
                    <SwiperSlide key={artist?.id} style={{ width: 'auto', height: 'auto' }}>
                        <div onClick={ ()=> navigate(`/artist/${artist.id}`)} className='cursor-pointer'>
                            {/* PlaybackButton stops the click from also opening the artist */}
                            <div key={artist.id} className='sp-card group w-44'>
                                <div className='relative'>
                                    <img src={artist.images?.[1]?.url ?? artist.images?.[0]?.url} alt='' className='rounded-full w-40 h-40 object-cover shadow-lg shadow-black/50 bg-sp-highlight' />
                                    <PlaybackButton size={48} className='sp-card-play absolute bottom-1 right-1' label={`Play ${artist.name}`}
                                        matchUri={artist.uri} options={{ contextUri: artist.uri }} />
                                </div>
                                <h5 className='mt-3 text-white font-semibold truncate'>{artist.name}</h5>
                                <span className='capitalize text-sm text-sp-subdued'>{artist.type}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                )}
            </Slider>



            <h5 className='sp-section-title capitalize'>Your Top Tracks</h5>
            <Slider>
                {topTracks && topTracks.items?.map((track, index) =>
                    <SwiperSlide key={track?.id} style={{ width: 'auto', height: 'auto' }}>
                        <Link to={`/track/${track.id}`}>
                            <div key={track.id} className='sp-card group w-48'>
                                <div className='relative'>
                                    <img src={track.album.images[0].url} className='rounded-md w-44 h-44 object-cover shadow-lg shadow-black/50' />
                                    {/* play this track, then continue through the rest of the top tracks */}
                                    <PlaybackButton size={48} className='sp-card-play absolute bottom-2 right-2' label={`Play ${track.name}`}
                                        matchUri={track.uri} options={{ uris: topTracks.items.slice(index).map(t => t.uri) }} />
                                </div>
                                <h5 className='mt-3 text-white font-semibold line-clamp-1'>{track.name}</h5>
                                <p className='text-sm text-sp-subdued line-clamp-1'>{track?.artists?.[0]?.name}</p>
                            </div>
                        </Link>
                    </SwiperSlide>
                )}
            </Slider>

            <h5 className='sp-section-title capitalize'>Your PlayLists</h5>
            <Slider>
                {playlists && playlists.items?.map((playlist, index) =>
                    <SwiperSlide key={playlist?.id} style={{ width: 'auto', height: 'auto' }}>
                        <Link to={`/playlist/${playlist.id}`} >
                            <div key={playlist.id} className='sp-card group w-48'>
                                <div className='relative'>
                                    {playlist?.images?.[0]
                                        ?<img src={`${playlist?.images[0]?.url}`} className='rounded-md w-44 h-44 object-cover shadow-lg shadow-black/50' />
                                        :<div className='w-44 h-44 rounded-md bg-sp-highlight flex items-center justify-center text-sp-subdued shadow-lg shadow-black/50'><Music size={64}/></div>
                                    }
                                    <PlaybackButton size={48} className='sp-card-play absolute bottom-2 right-2' label={`Play ${playlist.name}`}
                                        matchUri={playlist.uri} options={{ contextUri: playlist.uri }} />
                                </div>
                                <h5 className='mt-3 text-white font-semibold line-clamp-1'>{playlist.name}</h5>
                                <p className='text-sm text-sp-subdued line-clamp-1'>By {playlist?.owner?.display_name}</p>
                            </div>
                        </Link>
                    </SwiperSlide>
                )}
            </Slider>


            <h5 className='sp-section-title capitalize flex items-center gap-2'><Plus size={26}/>Create</h5>
            <Slider>
                    <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                        <div onClick={onClickCreatePlayList} className="group p-5 rounded-lg cursor-pointer flex flex-col justify-between w-60 h-44 bg-linear-to-br from-[#450af5] to-[#8e8ee5] hover:brightness-110 transition-all shadow-lg shadow-black/40">
                            <Music size={40}/>
                            <div>
                              <span className="text-lg font-bold">PlayList</span>
                              <p className='text-sm text-white/80'>Create a playlist with songs you like</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                        <div onClick={onClickCreateTopPlayList} className="group p-5 rounded-lg cursor-pointer flex flex-col justify-between w-60 h-44 bg-linear-to-br from-[#1e3264] to-[#1ed760] hover:brightness-110 transition-all shadow-lg shadow-black/40">
                            <AudioLines size={40}/>
                            <div>
                                <span className="text-lg font-bold">Top Tracks</span>
                                <p className='text-sm text-white/80'>Create Top songs playlist</p>
                            </div>
                        </div>
                    </SwiperSlide>
            </Slider>

            <div className='h-8' />

            {<Modal  type='create-playlist' open={createPlayListModalState} onClose={setCreatePlayListModalState} onClick={onSaveNewPlayList} defaultName={suggestedPlaylistName} />}

        </Container>
    )
}
