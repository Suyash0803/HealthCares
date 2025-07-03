import Router from 'express';
import  {readNotification}  from '../controllers/notif.controllers.js';


const notificationRouter = Router();

notificationRouter.route('/:notificationId/:_id/read').put(readNotification);
notificationRouter.route('/:userId/unread').get(readNotification); // Assuming you want to get unread notifications count
export default notificationRouter;