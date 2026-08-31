import dayjs from 'dayjs'

import { escape } from '../../../shared/utils/escape_characters.utils.js'

const AdminOrdersPipeline = (range, search, status) => {
  const filter = {}
  if (status) {
    switch (status) {
      case 'pending':
        filter['payment.status'] = 'pending'
        break
      case 'failed':
        filter['payment.status'] = { $in: ['deny', 'cancel', 'failure', 'expire'] }
        break
      case 'processing':
      case 'shipped':
      case 'delivered':
        filter['payment.status'] = { $in: ['settlement', 'capture'] }
        filter['shipping.status'] = status
        break
    }
  }

  if (range && range !== '') {
    let startDate
    const endDate = dayjs().endOf('day').toDate()

    switch (range) {
      case 'today':
        startDate = dayjs().startOf('day').toDate()
        break
      case '7d':
        startDate = dayjs().subtract(7, 'day').startOf('day').toDate()
        break
      case '30d':
        startDate = dayjs().subtract(30, 'day').startOf('day').toDate()
        break
      case '90d':
        startDate = dayjs().subtract(90, 'day').startOf('day').toDate()
        break
      default:
        startDate = null
        break
    }

    filter.createdAt = { $gte: startDate, $lte: endDate }
  }

  return [
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    ...(search
      ? [{ $match: { 'user.name': { $regex: escape(search.trim()), $options: 'i' } } }]
      : [])
  ]
}

const ReviewAnalytics = (statistic) => {
  return statistic.length > 0
    ? {
        average: statistic[0].average.toFixed(1),
        total: statistic[0].total,
        star5: statistic[0].star5,
        star4: statistic[0].star4,
        star3: statistic[0].star3,
        star2: statistic[0].star2,
        star1: statistic[0].star1
      }
    : {
        average: 0,
        total: 0,
        star5: 0,
        star4: 0,
        star3: 0,
        star2: 0,
        star1: 0
      }
}

export { AdminOrdersPipeline, ReviewAnalytics }
