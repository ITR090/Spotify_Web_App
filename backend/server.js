
const express = require('express')
const dotenv = require('dotenv')
const querystring = require('querystring');
const axios = require('axios');
const cors = require('cors')

// init application
const app = express()
// middleware
app.use(cors({origin: "http://localhost:5173"}))
app.use(express.json())  // usefull for mobile application 
app.use(express.urlencoded({ extended: true })) // usefull for form submtion data

// env
dotenv.config()
console.log(`Listening on port ${process.env.PORT}. Go /login to initiate authentication flow.`)
app.listen(process.env.PORT)


// routes

/**
 * node backend will send to spoitfy to redirect the  authorization URL
 * if everything are fine (client id correct) then spoitfy will look for a callback URL
 * the callback URL will send client secrt to spoify to get the acess token
 * after getting access token the callback URL will redifrect to client app
 * */

app.get('/spotify-login', (req, res) => {
    console.log('Login endpoint hit');
    var scope = 'user-read-private user-read-email user-top-read user-follow-read user-library-read playlist-modify-private playlist-modify-public user-read-playback-state';
    res.redirect(process.env.AUTHORIZATION + querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        scope:scope,
        show_dialog: true
    }))

})


app.get('/callback', (req, res) => {

    let code = req.query.code || null;

    try {
        axios.post('https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)}`
            }
        }
        ).then((data) => {

            let response = data.data
            console.log(response)
           
            // Redirect back to your frontend
            res.redirect("http://localhost:5173/" + '?access_token=' + response.access_token);
            // res.json({
            //     token:response.access_token
            // })
        })
    } catch (error) {
        console.log("error" + error)
    }
})



