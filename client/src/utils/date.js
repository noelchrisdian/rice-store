import dayjs from 'dayjs';
import id from "dayjs/locale/id";

const handleDate = (date) => {
    return dayjs(date).locale(id).format('DD MMMM YYYY')
}

export {
    handleDate
}