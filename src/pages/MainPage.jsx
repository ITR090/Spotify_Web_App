import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import Container from '../UI/Container'
import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
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

    const onClickCreatePlayList = () => {
        //setCreatePlayListModalState(!createPlayListModalState);
        createPlayList("My PlayList")
       
    }

    const onClickCreateTopPlayList=()=>{
        createTopTracksPlayList("My top tracks")
    }

    return (
        <Container>

            <h5 className='my-6 mx-3 text-xl font-bold capitalize'>Your favorite artists</h5>
            <Slider>
                {topArtists && topArtists.items?.map((artist) =>
                    <SwiperSlide key={artist?.id} style={{ width: 'auto', height: 'auto' }}>
                        <div onClick={ ()=> navigate(`/artist/${artist.id}`)}>
                            <div key={artist.id} className='rounded-lg hover:bg-light-gray-hover p-1'>
                                <img src={artist.images[2].url} className='rounded-full w-auto h-auto' />
                                <h5 className='mt-3'>{artist.name}</h5>
                                <span className='capitalize'>{artist.type}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                )}
            </Slider>



            <h5 className='my-6 mx-3 text-xl font-bold capitalize'>Your Top Tracks</h5>
            <Slider>
                {topTracks && topTracks.items?.map((track) =>
                    <SwiperSlide key={track?.id} style={{ width: 'auto', height: 'auto' }}>
                        <Link to={`/track/${track.id}`}>
                            <div key={track.id} className='rounded-lg hover:bg-light-gray-hover p-1'>
                                <img src={track.album.images[0].url} className='rounded-lg w-48' />
                                <h5 className='mt-3 line-clamp-1'>{track.name}</h5>
                            </div>
                        </Link>
                    </SwiperSlide>
                )}
            </Slider>
           
            <h5 className='my-6 mx-3 text-xl font-bold capitalize'>Your PlayLists</h5>
            <Slider>
                {playlists && playlists.items?.map((playlist, index) =>
                    <SwiperSlide key={playlist?.id} style={{ width: 'auto', height: 'auto' }}>
                        <Link to={`/playlist/${playlist.id}`} >
                            <div key={playlist.id} className='rounded-lg p-1'>
                                {playlist?.images?.[0] 
                                    ?<img src={`${playlist?.images[0]?.url}`} className='rounded-lg w-48' /> 
                                    :<Music className='w-full h-48 bg-gray-700'/>
                                }
                                <h5 className='mt-3 line-clamp-1'>{playlist.name}</h5>
                            </div>
                        </Link>
                    </SwiperSlide>
                )}
            </Slider>


            <h5 className='my-6 mx-3 text-xl font-bold capitalize'><Plus style={{ display :"inline-block"}}/>Create</h5>
            <Slider>
                    <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                        <div className="p-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 w-48 h-48 bg-gray-700 hover:bg-gray-600">
                            <Music size={52}/>
                            <div onClick={onClickCreatePlayList}>
                              <span className="text-md font-bold">PlayList</span>
                              <p className='text-sm'>Create a playlist with songs you like</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                        <div className="p-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 w-48 h-48 bg-gray-700 hover:bg-gray-600">
                            <AudioLines size={52}/>
                            <div onClick={onClickCreateTopPlayList}>
                                <span className="text-md font-bold">Top Tracks</span>
                                <p className='text-sm'>Create Top songs playlist</p>
                            </div>
                        </div>
                    </SwiperSlide>
            </Slider>

            {<Modal  type='create-playlist' open={createPlayListModalState} onClose={setCreatePlayListModalState} onClick={onClickCreatePlayList} />}

        </Container>
    )
}