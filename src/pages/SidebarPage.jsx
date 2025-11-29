import React, {useContext, useState } from 'react'
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import DisplayType from '../UI/DisplayType'
import SecondaryButton from '../UI/Buttons/SecondaryButton'
// Hooks
import useFetch from '../hooks/useFetch'


export default function Sidebar() {


    const sopt = useContext(SpotifyContext)

    // calling 3 apis followed albmus followed playlist followed artists
    const { data: followedArtists, errors: followedArtistsErrors} = useFetch('https://api.spotify.com/v1/me/following?type=artist')
    const { data: userSavedAlbums, errors :userSavedAlbumsErrors } = useFetch('https://api.spotify.com/v1/me/albums') 
    const playlist = sopt.getPlaylists()

    const filters = {
        playlists: playlist,
        followedArtists: followedArtists,
        userSavedAlbums: userSavedAlbums,
    }

    const [currentFilter, setCurrentFilter] = useState({
        type: "Artists",
        data: filters?.followedArtists
    });


    const onClickFliter = (filter_type) => {

        switch (filter_type) {

            case 'Playlist':
                setCurrentFilter({
                    type: "Playlist",
                    data: filters.playlists
                })
                return;
            case 'Artists':
                setCurrentFilter({
                    type: 'Artists',
                    data: filters.followedArtists
                })
                return;
            case 'Albums':
                setCurrentFilter({
                    type: 'Albums',
                    data: filters.userSavedAlbums
                })
                return;
            default:
                console.log('default case');
                return;
        }
    }


    let displayCurrectFilter;

    if (currentFilter.type == 'Playlist') {
        displayCurrectFilter = <DisplayType type='playlists' items={playlist?.items} />
    } else if (currentFilter.type == 'Artists') {
        displayCurrectFilter = <DisplayType type='artists' items={followedArtists?.artists?.items} />
    } else {
        displayCurrectFilter = <DisplayType type='albums' items={userSavedAlbums?.items} />
    }


    return (
        <div>             
                <div className='text-center'>
                    <h4 className='font-bold my-3'>
                        Your Library
                    </h4>
                </div>

                <div className='flex'>
                    <SecondaryButton id='Artists' clickFun={() => onClickFliter('Artists')} type="button">Artists</SecondaryButton>
                    <SecondaryButton id='Playlist' clickFun={() => onClickFliter('Playlist')} type="button">Playlist</SecondaryButton>
                    <SecondaryButton id='Albums' clickFun={() => onClickFliter('Albums')} type="button">Albums</SecondaryButton>
                </div>

                <div className='my-4'>
                    {(currentFilter) && displayCurrectFilter}
                </div>            
        </div>
    )
}

