import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
// context
import { StoreContext } from '../store/ContextStore'
// UI
import Container from '../UI/Container'
import Modal from '../UI/Modal'
// Hooks
import useFetch from '../hooks/useFetch'
// components
import Album from '../components/Album'


export default function AlbumPage() {

    const params = useParams()
    const ctx = useContext(StoreContext)

    const {data : album , errors: albmuError} = useFetch(`https://api.spotify.com/v1/albums/${params.id}?market=US`,params.id)
    
    if (albmuError) {
            return <Modal type='token-expired' open={true} />
        }
    
    return (
        <Container>
            <Album album={album}/>
        </Container>
    )
}
