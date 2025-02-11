import { useEffect, useState,useContext } from "react";
import { StoreContext } from "../store/ContextStore";

// endpoint, useEffect dep
export default function useFetch(url,dependency){

    
    const [fetchedData,setFetchedData] =useState()
    const ctx = useContext(StoreContext)
    
        useEffect(()=>{
            async function getAllData(){
               
                if (!ctx.token) {
                    let url = new URL(window.location.href)
                    let token = url.searchParams.get('access_token')
                    ctx.setUserToken(token)
                    ctx.setAuthenticated(true)
                  }
        
                if(ctx.authenticated && ctx.token){
                    try {
                        
                        const response = await fetch(url, {
                            headers: {
                                'Authorization': `Bearer ${ctx.token}`
                            }
                        })

                        if (response.status == 401) {
                            throw response.status
                        }
                        
                        if(!response.ok){
                            throw new Error(response.status)
                        }
                        const responseData = await response.json();
                        setFetchedData(responseData)
                    } catch (error) {
                        console.log("error: "+error.status)
                    }
                }
            }

            getAllData()
        },[ctx.token, ctx.authenticated,dependency])

        return {
            data: fetchedData,
            setFetchedData,setFetchedData
        }

}