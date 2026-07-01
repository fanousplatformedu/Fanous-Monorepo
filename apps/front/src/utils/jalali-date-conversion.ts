// import { toJalaali, toGregorian } from 'jalaali-js'
import moment from 'jalali-moment'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

// Extend dayjs with the jalaliday plugin
// dayjs.extend(utc)
dayjs.extend(jalaliday)

export function convertToPersianDate(isoStringDate: string): string {
    // Parse the ISO string and convert the date to the Jalali (Persian) calendar.
    // The locale 'fa' is set for Persian formatting.
    return dayjs(isoStringDate)
        .calendar('jalali')
        .locale('fa')
        .format('YYYY/MM/DD')
}

// export function convertJalaliToDate(jalaliDate: string): Date {
//     const jalaliMoment = moment.from(jalaliDate, '', 'YYYY/MM/DD')

//     // Switch to the Gregorian (default) locale if needed.
//     // const gregorianMoment = jalaliMoment.locale('en')

//     // Convert the moment object to a native JavaScript Date.
//     const dateObj: Date = jalaliMoment.toDate()
//     console.log(dateObj, jalaliMoment)
//     return dateObj
// }

export function convertJalaliToDate(
    persianDate: string
): string {
    // Parse the Persian date string using the Jalali format tokens.
    const jalaliDate = moment.from(persianDate, 'fa', 'jYYYY/jMM/jDD').endOf('D')

    // Validate that the date was parsed correctly.
    if (!jalaliDate.isValid()) {
        throw new Error('Invalid Persian date.')
    }

    return jalaliDate.toDate().toISOString()
}
