export const swapRatingToIcon = (score, rating) =>
    rating
        ? rating.find(r => r.score === score).icon
        : 'fas fa-spinner'