import { redirect } from "react-router-dom"

export const checkUserToken = ()=>{
    const token =  JSON.parse(localStorage.getItem('userToken'))?.token
    if(!token){
        return redirect('/login')
    }
}