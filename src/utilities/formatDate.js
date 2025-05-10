
//  MM DAY YEAR
export function formatDate(date){ 
    const Fulldate = new Date(date)
    const FullYear =  Fulldate.toLocaleString('default', { month: 'long' }) + " " + Fulldate.getDay() + " " + Fulldate.getFullYear();
    return FullYear
}