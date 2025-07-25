import Club from "../models/clubModel.js";
import User from "../models/userModel.js";

export const createClub = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  try {
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: "Club name already taken",
      });
    }

    const newClub = await Club.create({
      name,
      description,
      coverImage: req.file?.path,
      createdBy: userId,
      members: [userId],
      admins: [userId],
    });

    res.status(201).json({
      success: true,
      message: "Club creation successfull",
      club: newClub,
    });
  } catch (error) {
    console.log("Error in createClub controller : ", error.message);

    res.status(500).json({
      success: false,
      message: "Error Creating Club",
      error: error.message,
    });
  }
};

export const getAllClubs = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    const filter = isAdmin ? {} : { members: { $ne: userId } };

    const clubs = await Club.find(filter)
      .populate("createdBy", "name")
      .select("-__v");

    res.status(200).json({
      success: true,
      clubs,
    });
  } catch (error) {
    console.log("Error in getAllClubs controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching clubs",
      error: error.message,
    });
  }
};

export const getUserClubs = async (req, res) => {
  const userId = req.user._id;
  try {
    const clubs = await Club.find({ members: userId })
      .populate("createdBy", "name profileImageUrl")
      .select("-__v");

    res.status(200).json({
      success: true,
      clubs,
    });
  } catch (error) {
    console.log("Error in getUserClubs controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching clubs",
      error: error.message,
    });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("members", "name email profileImageUrl")
      .populate("admins", "name email")
      .populate("createdBy", "name");

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    res.status(200).json({
      success: true,
      club,
    });
  } catch (error) {
    console.log("Error in getClubById controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching club",
      error: error.message,
    });
  }
};

export const joinClub = async (req, res) => {
  const userId = req.user._id;
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already a member",
      });
    }

    club.members.push(userId);
    await club.save();

    res.status(200).json({
      success: true,
      message: "Joined club successfully",
      club,
    });
  } catch (error) {
    console.log("Error in joinClub controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error joining club",
      error: error.message,
    });
  }
};

export const leaveClub = async (req, res) => {
  const userId = req.user._id;
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Club creator cannot leave the club",
      });
    }

    if (!club.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Not a member of this club",
      });
    }

    club.members = club.members.filter(
      (id) => id.toString() !== userId.toString()
    );
    club.admins = club.admins.filter(
      (id) => id.toString() !== userId.toString()
    );

    await club.save();
    res.status(200).json({
      success: true,
      message: "Left club successfully",
    });
  } catch (error) {
    console.log("Error in leaveClub controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error leaving club",
      error: error.message,
    });
  }
};

export const updateClub = async (req, res) => {
  const userId = req.user._id;

  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (!club.admins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update the club",
      });
    }

    const { name, description, removeCoverImage } = req.body;
    const coverImage = req.file?.path;

    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: "Club Name is already in use",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description;
    if (coverImage !== undefined) updateFields.coverImage = coverImage;
    if (removeCoverImage) updateFields.coverImage = "";

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Club updated successfully",
      club: updatedClub,
    });
  } catch (error) {
    console.log("Error in updateClub controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating club",
      error: error.message,
    });
  }
};

export const deleteClub = async (req, res) => {
  const userId = req.user._id;
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete the club",
      });
    }

    await Club.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteClub controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating club",
      error: error.message,
    });
  }
};

export const toggleAdmin = async (req, res) => {
  const userId = req.user._id;
  const { userToToggle } = req.body;

  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const isClubAdmin = club.admins.includes(userId.toString());

    if (!isClubAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    const isUserMember = club.members.includes(userToToggle);

    if (!isUserMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of the club",
      });
    }

    const isAlreadyAdmin = club.admins.includes(userToToggle);

    if (isAlreadyAdmin) {
      club.admins = club.admins.filter(
        (adminId) => adminId.toString() !== userToToggle.toString()
      );
    } else {
      club.admins.push(userToToggle);
    }

    await club.save();

    res.status(200).json({
      success: true,
      message: `User ${
        isAlreadyAdmin ? "removed from" : "added as"
      } admin successfully`,
      admins: club.admins,
    });
  } catch (error) {
    console.error("Error in toggleAdmin controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error toggling admin status",
      error: error.message,
    });
  }
};

export const removeMemberFromClub = async (req, res) => {
  const adminId = req.user._id;
  const { userToRemove } = req.body;

  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const isAdmin = club.admins.some(
      (admin) => admin.toString() === adminId.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    if (!club.members.some((member) => member.toString() === userToRemove)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of the club",
      });
    }

    club.members = club.members.filter((id) => id.toString() !== userToRemove);

    club.admins = club.admins.filter((id) => id.toString() !== userToRemove);

    await club.save();

    res.status(200).json({
      success: true,
      message: "User removed from club successfully",
      club,
    });
  } catch (error) {
    console.error("Error in handleRemoveMemberFromClub:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
