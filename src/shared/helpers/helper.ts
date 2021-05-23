export const swapRatingToIcon = (
  scoreID: string | number,
  rating: any,
): string => {
  return rating
    ? rating.find((r: any) => r.id === scoreID).icon
    : 'fas fa-spinner';
};
