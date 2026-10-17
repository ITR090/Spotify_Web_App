import React, {useContext, useState } from 'react'
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import DisplayType from '../UI/DisplayType'
import SecondaryButton from '../UI/Buttons/SecondaryButton'
// Hooks
import useFetch from '../hooks/useFetch'
// icons
import { Library } from 'lucide-react'

export default function Sidebar() {


    const {playlists, playlistErr} = useContext(SpotifyContext)
    const {followedArtists, followedArtistsErrors} = useContext(SpotifyContext)
    const {userSavedAlbums, userSavedAlbumsErrors} = useContext(SpotifyContext)


    const filters = {
        playlists: playlists,
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
                return;
        }
    }


    let displayCurrectFilter;

    if (currentFilter.type == 'Playlist') {
        displayCurrectFilter = <DisplayType type='playlists' items={playlists?.items} />
    } else if (currentFilter.type == 'Artists') {
        displayCurrectFilter = <DisplayType type='artists' items={followedArtists?.artists?.items} />
    } else {
        displayCurrectFilter = <DisplayType type='albums' items={userSavedAlbums?.items} />
    }


    return (
        <div>
                <div className='flex items-center gap-3 px-2 pt-2 pb-4 text-sp-subdued hover:text-white transition-colors'>
                    <Library size={24} />
                    <h4 className='font-bold text-base'>
                        Your Library
                    </h4>
                </div>

                <div className='flex px-2'>
                    <SecondaryButton id='Artists' active={currentFilter.type == 'Artists'} clickFun={() => onClickFliter('Artists')} type="button">Artists</SecondaryButton>
                    <SecondaryButton id='Playlist' active={currentFilter.type == 'Playlist'} clickFun={() => onClickFliter('Playlist')} type="button">Playlists</SecondaryButton>
                    <SecondaryButton id='Albums' active={currentFilter.type == 'Albums'} clickFun={() => onClickFliter('Albums')} type="button">Albums</SecondaryButton>
                </div>

                <div className='mt-3'>
                    {(currentFilter) && displayCurrectFilter}
                </div>
        </div>
    )
}
