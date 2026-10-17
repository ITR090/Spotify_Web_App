import { useEffect, useState, useContext, useCallback } from "react";
import { StoreContext } from "../store/ContextStore";
import axios from 'axios'

// endpoint, useEffect dep
export default function useFetch(url) {


    const [fetchedData, setFetchedData] = useState()
    const [errors, setErrors] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const ctx = useContext(StoreContext)

    useEffect(() => {
        async function getAllData() {

            try {

                if (!ctx.token) {
                    let pageUrl = new URL(window.location.href)
                    let token = pageUrl.searchParams.get('access_token')
                    if (token) {
                        // fresh login: store the new token and strip it from the address bar
                        // (only here — otherwise every fetch after a refresh reset the URL to '/')
                        window.history.replaceState({}, null, '/')
                        localStorage.setItem('userToken', JSON.stringify({ token: token }))
                        ctx.setUserToken(token)
                    } else {
                        // page refresh: restore the token saved from the last login
                        let localhostToken = JSON.parse(localStorage.getItem('userToken'))?.token
                        if (localhostToken) ctx.setUserToken(localhostToken)
                    }
                }
                 const token = JSON.parse(localStorage.getItem('userToken')).token

                if (token) {
                    
                    const response = await axios.get(url, {
                        headers:{
                            'Authorization': `Bearer ${token}`
                        }
                    }) 
                    
                    // token exipred
                    if (response.status == 401) {
                        throw ('Unauthorized please login')
                    }

                    // Bad requset
                    if (response.status == 400) {
                        throw ('Bad Requset')
                    }

                    // // any issues
                    // if (!response.ok) {
                    //     throw ('Please try again later')
                    // }
                    
                    setFetchedData(response.data)
                    

                } else {
                    // if token = to null in (local storage).
                    throw ('Unauthorized please login')
                }
            } catch (error) {
                setErrors(error)
            }
        }

        getAllData()

    }, [url])  // was ctx.token, ctx.authenticated,dependency

    return {
        data: fetchedData,
        setFetchedData,
        errors: errors
    }

}