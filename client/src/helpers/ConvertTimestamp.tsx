export function postgresToDate(date: string | undefined) {
    if (date)
        return new Date(date.replace(' ', 'T'));
}

export function getYear(timestamp: string | undefined) {
    if (timestamp)
        return timestamp.split('-')[0];
}

export function getMonth(timestamp: string | undefined) {
    if (timestamp)
        return timestamp.split('-')[1];
}

export function getDay(timestamp: string | undefined) {
    if (timestamp)
        return timestamp.split('-')[2];
}
