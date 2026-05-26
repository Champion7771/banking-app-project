import Notification from "../models/notification.model";

export const getNotificationsService = async (userId: string) => {
  return await Notification.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};
