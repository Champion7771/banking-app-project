import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import { getNotificationsService } from "../services/notification.service";

export const getNotifications = catchAsync(async (req: any, res: Response) => {
  const notifications = await getNotificationsService(req.user.userId);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});
