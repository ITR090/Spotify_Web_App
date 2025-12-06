import { redirect } from "react-router-dom"

export const getToken = () => {
    return JSON.parse(localStorage.getItem('userToken')).token;
}

//  MM DAY YEAR
export function formatDate(date) {
    const Fulldate = new Date(date)
    const FullYear = Fulldate.toLocaleString('default', { month: 'long' }) + " " + Fulldate.getDay() + " " + Fulldate.getFullYear();
    return FullYear
}

export function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const checkUserToken = () => {
    const token = JSON.parse(localStorage.getItem('userToken'))?.token
    if (!token) {
        return redirect('/login')
    }
}