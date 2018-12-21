export const swapRatingToIcon = (score, rating) =>
    rating
        ? rating.find(r => r.score === score).link
        : 'fas fa-spinner'