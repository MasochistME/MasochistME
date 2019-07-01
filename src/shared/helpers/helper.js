export const swapRatingToIcon = (scoreID, rating) => {
    console.log(scoreID)
    console.log(rating)
    return rating
        ? rating.find(r => r.id === scoreID).icon
        : 'fas fa-spinner'
}