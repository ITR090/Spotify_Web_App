import { useEffect, useState,useContext } from "react";
import { StoreContext } from "../store/ContextStore";



export default function useFetchPost(url) {

    const ctx = useContext(StoreContext)

    const handlePost=  async (data)=> {

    let token = localStorage.getItem('userToken')
        if(token){
           try {

            const response = await fetch(url,{
                headers:{
                   'Authorization': `Bearer ${ctx.token}`,
                   'Content-Type': 'application/json',
                },
                method:'POST',
                body: JSON.stringify(data)
            })
            
            if (response.status == 401) {
                throw response.status
            }
            
            if(!response.ok){
                throw new Error(response.status)
            }

            if(response.ok){
                return await response.json();
            }
           } catch (error) {
              console.log("error: "+error.status)
           }
        }
    }

    return {
        handlePost
    }
  
}
