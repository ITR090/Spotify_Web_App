import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
// context
import { StoreContext } from "./ContextStore";
// helpers
import { getToken } from "../utilities/helpers";

/**
 * In-browser playback using Spotify's Web Playback SDK (https://sdk.scdn.co/spotify-player.js)
 * + PUT /v1/me/player/play. Both are current, non-deprecated APIs.
 *
 * Requirements (enforced by Spotify):
 *  - the listener needs Spotify Premium
 *  - the token needs the `streaming` + `user-modify-playback-state` scopes
 */

const SDK_URL = 'https://sdk.scdn.co/spotify-player.js'
const PLAYER_NAME = 'Spotify Web App'

const PlayerContext = createContext({
    ready: false,
    error: null,
    currentTrack: null,
    paused: true,
    position: 0,
    duration: 0,
    volume: 0.5,
    playTrack: async () => false,
    togglePlay: () => {},
    nextTrack: () => {},
    previousTrack: () => {},
    seek: () => {},
    setVolume: () => {},
    clearError: () => {},
})

// load the SDK script once and resolve with window.Spotify
let sdkPromise = null
const loadSdk = () => {
    if (sdkPromise) return sdkPromise
    sdkPromise = new Promise((resolve, reject) => {
        if (window.Spotify) return resolve(window.Spotify)
        window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify)
        const script = document.createElement('script')
        script.src = SDK_URL
        script.async = true
        script.onerror = () => { sdkPromise = null; reject(new Error('sdk_load_failed')) }
        document.body.appendChild(script)
    })
    return sdkPromise
}

// user-facing messages for the SDK / API failures
const ERRORS = {
    premium: 'Spotify Premium is required to play music here.',
    auth: 'Log in again to allow playback in this app.',
    init: "This browser can't play Spotify music.",
    sdk: "Couldn't load the Spotify player. Check your connection or ad blocker.",
    device: 'The player is still starting. Please try again in a moment.',
    generic: "Couldn't play this track. Please try again.",
}

const PlayerContextProvider = (props) => {

    const ctx = useContext(StoreContext)

    const playerRef = useRef(null)
    const [deviceId, setDeviceId] = useState(null)
    const [error, setError] = useState(null)
    // raw SDK state + the time we received it (to animate the progress bar)
    const [playerState, setPlayerState] = useState(null)
    const [stateAt, setStateAt] = useState(0)
    const [now, setNow] = useState(() => performance.now())
    const [volume, setVolumeState] = useState(0.5)

    // create the player once we have a token
    useEffect(() => {
        if (!ctx.token || playerRef.current) return
        let cancelled = false

        loadSdk().then((Spotify) => {
            if (cancelled || playerRef.current) return

            const player = new Spotify.Player({
                name: PLAYER_NAME,
                getOAuthToken: (cb) => cb(getToken()),
                volume: 0.5,
            })
            playerRef.current = player

            player.addListener('ready', ({ device_id }) => setDeviceId(device_id))
            player.addListener('not_ready', () => setDeviceId(null))
            player.addListener('player_state_changed', (state) => {
                setPlayerState(state)
                setStateAt(performance.now())
            })
            player.addListener('initialization_error', () => setError(ERRORS.init))
            player.addListener('authentication_error', () => setError(ERRORS.auth))
            player.addListener('account_error', () => setError(ERRORS.premium))
            player.addListener('playback_error', () => setError(ERRORS.generic))

            player.connect()
        }).catch(() => setError(ERRORS.sdk))

        return () => { cancelled = true }
    }, [ctx.token])

    // disconnect when the app unmounts
    useEffect(() => () => playerRef.current?.disconnect(), [])

    // tick while playing so the progress bar moves smoothly
    const paused = playerState?.paused ?? true
    useEffect(() => {
        if (paused) return
        const timer = setInterval(() => setNow(performance.now()), 500)
        return () => clearInterval(timer)
    }, [paused])

    const duration = playerState?.duration ?? 0
    const position = playerState
        ? Math.min(duration, playerState.position + (paused ? 0 : Math.max(0, now - stateAt)))
        : 0

    /**
     * Start playback in this browser.
     *  - contextUri + offsetUri: play an album/playlist starting at a track (next/previous follow it)
     *  - uris: play a list of track URIs (starts at the first one)
     * Returns true when Spotify accepted the request.
     */
    const playTrack = useCallback(async ({ uris, contextUri, offsetUri } = {}) => {
        setError(null)
        if (!deviceId) {
            setError(ERRORS.device)
            return false
        }
        // browsers only allow audio after a user gesture; this must run inside the click
        playerRef.current?.activateElement?.()

        const body = contextUri
            ? { context_uri: contextUri, ...(offsetUri ? { offset: { uri: offsetUri } } : {}) }
            : { uris }

        try {
            await axios.put(`https://api.spotify.com/v1/me/player/play`, body, {
                params: { device_id: deviceId },
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            })
            return true
        } catch (err) {
            const status = err?.response?.status
            const reason = err?.response?.data?.error?.reason
            if (status === 401) setError(ERRORS.auth)
            else if (status === 403 && reason === 'PREMIUM_REQUIRED') setError(ERRORS.premium)
            else if (status === 403) setError(ERRORS.auth)
            else if (status === 404) setError(ERRORS.device)
            else setError(ERRORS.generic)
            return false
        }
    }, [deviceId])

    const togglePlay = useCallback(() => {
        playerRef.current?.activateElement?.()
        playerRef.current?.togglePlay()
    }, [])
    const nextTrack = useCallback(() => playerRef.current?.nextTrack(), [])
    const previousTrack = useCallback(() => playerRef.current?.previousTrack(), [])
    const seek = useCallback((ms) => {
        playerRef.current?.seek(ms)
        // optimistic update so the bar doesn't jump back while Spotify catches up
        setPlayerState(state => state && { ...state, position: ms })
        setStateAt(performance.now())
        setNow(performance.now())
    }, [])
    const setVolume = useCallback((value) => {
        setVolumeState(value)
        playerRef.current?.setVolume(value)
    }, [])
    const clearError = useCallback(() => setError(null), [])

    return (
        <PlayerContext.Provider value={{
            ready: Boolean(deviceId),
            error,
            currentTrack: playerState?.track_window?.current_track ?? null,
            paused,
            position,
            duration,
            volume,
            playTrack,
            togglePlay,
            nextTrack,
            previousTrack,
            seek,
            setVolume,
            clearError,
        }}>
            {props.children}
        </PlayerContext.Provider>
    )
}

/**
 * Helper for anything that plays a track (rows, cards, big green buttons).
 * matchUri: the track/album/playlist URI this control represents, used to show
 *           "playing" state and to toggle pause instead of restarting.
 * options:  what to send to playTrack() when it isn't the current item.
 */
const usePlayback = (matchUri, options) => {
    const player = useContext(PlayerContext)
    const current = player.currentTrack
    const isCurrent = Boolean(matchUri && current && (
        current.uri === matchUri ||
        current.album?.uri === matchUri ||
        current.linked_from?.uri === matchUri ||
        current.artists?.some(artist => artist.uri === matchUri)
    ))
    const isPlaying = isCurrent && !player.paused

    const onPlay = (e) => {
        // controls often sit inside links/cards: don't navigate
        e?.preventDefault?.()
        e?.stopPropagation?.()
        if (isCurrent) player.togglePlay()
        else player.playTrack(options)
    }

    return { isCurrent, isPlaying, onPlay }
}

export { PlayerContext, PlayerContextProvider, usePlayback }
