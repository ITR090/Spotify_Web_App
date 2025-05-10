import { useEffect, useState,useContext } from "react";
import { StoreContext } from "../store/ContextStore";

// endpoint, useEffect dep
export default function useFetch(url,dependency){

    
    const [fetchedData,setFetchedData] =useState()
    const [Errors,setErrors] =useState()
    
    const ctx = useContext(StoreContext)
   
        useEffect(()=>{
            async function getAllData(){
               
                try {
                    if (!ctx.token) {
                        let url = new URL(window.location.href)
                        let token = url.searchParams.get('access_token')
                        window.history.pushState({},null,'/')
                        let localhostToken= localStorage.getItem('userToken')
                        if(!localhostToken){
                            localStorage.setItem('userToken',JSON.stringify({token:token}))
                        }
                      }
                      const token =  JSON.parse(localStorage.getItem('userToken')).token
                      ctx.setUserToken(token)
                       
                    if(token){
                        try {
                            
                            const response = await fetch(url, {
                                headers: {
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

                            // any issues
                            if(!response.ok){
                                throw ('Please try again later')
                            }
                            const responseData = await response.json();
                            setFetchedData(responseData)
                        } catch (error) {
                           setErrors(error)
                        }
                    }else{
                        // if token = to null in (local storage).
                        throw ('Unauthorized please login') 
                    }
                } catch (error) {
                    setErrors(error)
                }
            }

            getAllData()
        },[ctx.token, ctx.authenticated,dependency])

        return {
            data: fetchedData,
            setFetchedData,setFetchedData,
            errors:Errors
        }

}