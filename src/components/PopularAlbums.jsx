import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../store/ContextStore'

export default function PopularAlbums() {

    const [albums, setAlbums] = useState()
    const ctx = useContext(StoreContext)

    const getPopularAlbums = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/albums?ids=7kFyd5oyJdVX2pIi6P4iHE,3T4tUhGYeRNVUGevb0wThu,1NAmidJlEaVgA3MpcPFYGq,1Mo4aZ8pdj6L1jx8zSwJnt,2fenSS68JI1h4Fo296JfGr,0mZIUXje90JtHxPNzWsJNR,6DEjYFkNZh67HP7R9PSZvv,64LU4c1nfjz1t4VnGhagcg&market=US', {
                headers: {
                    'Authorization': `Bearer ${ctx.token}`
                }
            })
            const responseData = await response.json();
            //console.log(responseData)
            setAlbums(responseData.albums);
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getPopularAlbums();
    }, [])


    return (
        <>
            <h6 className='my-3'>Popular Albums in US</h6>
            <div className='flex gap-4 overflow-x-auto scroll-smooth'>
                {albums && albums.map((album) => {
                    return (
                        <div key={album.id} className='bg-black rounded-lg'>
                            <img src={album.images[1].url} className='rounded-lg' alt="" />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
