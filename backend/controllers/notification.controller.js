import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      to: req.user._id,
    }).populate({ path: "from", select: "username profileImg" });

    // Update the notifications to read
    await Notification.updateMany(
      { to: req.user._id, read: false },
      { read: true }
    );


  } catch (error) {
    console.log("Error in getNotifications Controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
    try {
        await Notification.deleteMany({ to: req.user._id });
    res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotification Controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    } 
};
