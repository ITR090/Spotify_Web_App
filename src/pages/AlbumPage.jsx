import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
// context
import { StoreContext } from '../store/ContextStore'
// UI
import Container from '../UI/Container'
// icon
import play_button from '../assets/icons/play-button.png'
import checked from '../assets/icons/checked.png'
import clock from '../assets/icons/clock.png'
// utils
import { millisToMinutesAndSeconds } from '../utilities/millisToMinutesAndSeconds'
// Hooks
import useFetch from '../hooks/useFetch'
// components
import Album from '../components/Album'


export default function AlbumPage() {

    const params = useParams()
    const ctx = useContext(StoreContext)

    const {data : album} = useFetch(`https://api.spotify.com/v1/albums/${params.id}?market=US`,params.id)

    return (
        <Container>
            <Album album={album}/>
        </Container>
    )
}
