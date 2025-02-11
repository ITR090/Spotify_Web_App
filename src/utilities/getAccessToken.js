

let client_id = '823cc7607b4746beb57e084b3f99257a';
let client_Secret ='c0a82f5342b04da48f08465964b71aa4';
let redirect_uri = 'http://localhost:5173/callback';
//let authorization  = 'https://accounts.spotify.com/authorize'
let authorization =`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}`

export const getToken = async ()=>{

let response  =  await fetch('https://accounts.spotify.com/api/token',{
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            //Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_Secret).toString('base64'))
            'Authorization': `Basic ${btoa(`${client_id}:${client_Secret}`)}`
        },
        body: new URLSearchParams({
           grant_type: 'client_credentials'
        })
    })

    return await response.json(); 
}