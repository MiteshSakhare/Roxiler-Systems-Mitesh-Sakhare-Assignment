import axiosClient from './axiosClient';

export const ratingApi = {
  upsertRating: (storeId: number, rating: number) =>
    axiosClient.post(`/stores/${storeId}/rating`, { rating }),
};
