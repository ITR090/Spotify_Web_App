import { redirect } from "react-router-dom"

export const getToken = () => {
    return JSON.parse(localStorage.getItem('userToken')).token;
}

//  MM DAY YEAR
export function formatDate(date) {
    if (!date) return ''
    const Fulldate = new Date(date)
    if (isNaN(Fulldate)) return ''
    // Spotify dates are plain "YYYY", "YYYY-MM" or "YYYY-MM-DD" (parsed as UTC), so read
    // them in UTC to avoid shifting a day back in time zones west of UTC.
    const month = Fulldate.toLocaleString('default', { month: 'long', timeZone: 'UTC' })
    const precision = String(date).split('-').length
    if (precision === 1) return `${Fulldate.getUTCFullYear()}`
    if (precision === 2) return `${month} ${Fulldate.getUTCFullYear()}`
    // getUTCDate() = day of month (getDay() was the day of the week).
    const FullYear = month + " " + Fulldate.getUTCDate() + ", " + Fulldate.getUTCFullYear();
    return FullYear
}

export function millisToMinutesAndSeconds(millis) {
    // floor to whole seconds (rounding could show "0:60")
    var totalSeconds = Math.floor((millis || 0) / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const checkUserToken = () => {
    const token = JSON.parse(localStorage.getItem('userToken'))?.token
    if (!token) {
        return redirect('/login')
    }
}