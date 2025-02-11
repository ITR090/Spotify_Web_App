import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../store/ContextStore'

export default function PopularArtists() {

    const [artists, setArtists] = useState()
    const ctx = useContext(StoreContext)
   
    const getPopularArtists =async ()=>{
        try {
            const response = await  fetch('https://api.spotify.com/v1/artists?ids=3eVa5w3URK5duf6eyVDbu9,06HL4z0CvFAxyc27GXpf02,246dkjvS1zLTtiykXe5h60,0du5cEVh5yTK9QJze8zA0C,6eUKZXaKkcviH0Ku9w2n3V,5ZsFI1h6hIdQRw2ti0hz81,74KM79TiuVKeVCqs8QtB0B,1McMsnEElThX1knmY4oliG',{
                headers: {
                    'Authorization': `Bearer ${ctx.token}`
                }
            })
            const responseData = await response.json();
            //console.log(responseData)
            setArtists(responseData.artists)
        } catch (error) {
            console.log(error)
        }
    } 
    useEffect(() => {
        getPopularArtists()
    }, [])


    return (
        <>
            <h6 className='mb-3'>Popular Artists</h6>
            <div className='grid lg:grid-cols-5 md:grid-cols-3 gap-4'>
                {artists && artists.map((artist) => {
                    return <div key={artist.id} className='flex items-center bg-black rounded-lg justify-between'>
                        <img src={artist.images[2].url} className='rounded-lg w-1/4' />
                        <h5 className='pl-2 w-3/4 '>{artist.name}</h5>
                    </div>
                })}
            </div>
        </>
    )
}
