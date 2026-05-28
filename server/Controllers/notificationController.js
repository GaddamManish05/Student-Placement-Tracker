import Notification
from "../Models/notificationModel.js";


import User
from "../Models/userModel.js";
// ======================================
// GET USER NOTIFICATIONS
// ======================================
export const getNotifications =
async (
  req,
  res
) => {

  try {

    const notifications =
    await Notification.find({

      userId:
        req.user._id,

    })
    .sort({
      createdAt: -1
    });

    const unreadCount =
    notifications.filter(
      (item) =>
        !item.isRead
    ).length;

    return res.status(200).json({

      success: true,

      notifications,

      unreadCount,
    });

  } catch (error) {

    return res.status(500).json({

      message:
        error.message,
    });
  }
};

// ======================================
// MARK AS READ
// ======================================
export const markAsRead =
async (
  req,
  res
) => {

  try {

    await Notification.findByIdAndUpdate(

      req.params.id,

      {
        isRead: true,
      }
    );

    return res.status(200).json({

      success: true,
    });

  } catch (error) {

    return res.status(500).json({

      message:
        error.message,
    });
  }
};

// ======================================
// ADMIN BROADCAST NOTIFICATION
// ======================================
export const createBroadcastNotification =
async (req, res) => {

  try {

    const {

      title,

      message,

      type,

    } = req.body;

    // ==================================
    // GET ALL ACTIVE STUDENTS
    // ==================================
    const students =
    await User.find({

      role: "student",

      isActive: true,

    }).select("_id");

    // ==================================
    // CREATE NOTIFICATIONS
    // ==================================
    const notifications =
    students.map(
      (student) => ({

        userId:
        student._id,

        title,

        message,

        type,
      })
    );

    // ==================================
    // INSERT MANY
    // ==================================
    await Notification.insertMany(
      notifications
    );

    return res.status(201).json({

      success: true,

      message:
      "Notification broadcasted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to broadcast notification",
    });
  }
};