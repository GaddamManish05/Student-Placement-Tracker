import express
from "express";

import {

  getNotifications,

  markAsRead,

  createBroadcastNotification

} from "../Controllers/notificationController.js";

import {

  isAuthenticated,

} from "../Middlewares/authMiddleware.js";

import { isAdmin } from "../Middlewares/adminMiddleware.js";

const notificationRoutes =
express.Router();

// ======================================
// GET NOTIFICATIONS
// ======================================
notificationRoutes.get(

  "/",

  isAuthenticated,

  getNotifications
);

// ======================================
// MARK AS READ
// ======================================
notificationRoutes.put(

  "/:id",

  isAuthenticated,

  markAsRead
);


notificationRoutes.post(

  "/broadcast",

  isAuthenticated,

  isAdmin,

  createBroadcastNotification
);
export default notificationRoutes;