import dayjs from 'dayjs';
import id from "dayjs/locale/id";

const handleDate = (date) => {
    return dayjs(date).locale(id).format('DD MMMM YYYY');
}

const handleDatetime = (date) => {
    return dayjs(date).locale(id).format('DD MMMM YYYY, HH:mm [WIB]');
}

export {
    handleDate,
    handleDatetime
}