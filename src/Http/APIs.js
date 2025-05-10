


export const SearchSpotLibrary = async (url,)=>{
   
   const token =  JSON.parse(localStorage.getItem('userToken')).token
   const response= await fetch(url,{
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
    return await response.json();

}