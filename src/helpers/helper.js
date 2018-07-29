import rating from '../config/rating'

export const swapRatingToIcon = score => rating.find(r => r.score === score).icon