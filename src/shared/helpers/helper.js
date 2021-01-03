export const swapRatingToIcon = (scoreID, rating) => {
  return rating ? rating.find(r => r.id === scoreID).icon : 'fas fa-spinner';
};
