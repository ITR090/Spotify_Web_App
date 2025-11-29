import axios from "axios";


export const getToken = ()=>{
    return JSON.parse(localStorage.getItem('userToken')).token;
}

export const GetCurrentUserProfile = async () => {

    try {
           const token = JSON.parse(localStorage.getItem('userToken')).token  
           const response = await axios.post(
            'https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }   
} 

export const CreatePlayList = async (user_id, name) => {
    try {
        const token = JSON.parse(localStorage.getItem('userToken')).token
        const response = await axios.post(
            `https://api.spotify.com/v1/users/${user_id}/playlists`,
            {
                playlist_name: name
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}


export const SearchSpotLibrary = async (url,) => {

    const token = JSON.parse(localStorage.getItem('userToken')).token
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
    if (!response.ok) {
        throw ('Please try again later')
    }
    return await response.json();

}