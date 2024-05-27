const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Admin = require("../models/AdminModel");
const generateToken = require("../utils/index");

// Register a new admin
const register = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    !fullname ||
      !email ||
      (!password &&
        (() => {
          res.status(400);
          throw new Error("Please! fill all the required fields");
        })());

    password.length < 6 &&
      (() => {
        res.status(400);
        throw new Error("Password must be up to 6 characters!");
      })();

    // Check if user already exists
    const adminExists = await Admin.findOne({ email });

    adminExists &&
      (() => {
        res.status(400);
        throw new Error("Email already exists");
      })();

    // create new admin
    const admin = await Admin.create({
      fullname,
      email,
      password,
    });

    const token = generateToken(admin._id);

    //   send http-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    if (admin) {
      const { _id, fullname, email, role } = admin;

      res.status(201).json({
        _id,
        fullname,
        email,
        role,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Data");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

// Admin login
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // check id admin exists
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credientials!" });
    }

    const token = generateToken(admin._id);

    if (admin && isMatch) {
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      const { _id, fullname, email, role } = admin;

      // send HTTP-only cookie
      res.status(201).json({
        _id,
        fullname,
        email,
        role,
        token,
      });
    } else {
      res.status(500);
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Delete an admin

const deleteAdmin = asyncHandler(async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = Admin.findById(adminId);
    if (!admin) {
      res.status(404);
      throw new Error("user not found");
    }

    await admin.deleteOne();
    res.status(200).json({
      message: "Admin data deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

const getAdmin = asyncHandler(async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);

    if (admin) {
      const { _id, fullname, email, role } = admin;

      res.status(200).json({
        _id,
        fullname,
        email,
        role,
      });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

// Get details of all admins

const getAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().sort("-createdAt").select("-password");
  if (!admins) {
    res.status(500);
    throw new Error("something went wrong");
  }

  res.status(200).json(admins);
});



const updateAdmin = asyncHandler(async (req, res) => {
  const {adminId} = req.params
  try {
    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    // Update admin properties if they exist in the request body
    if (req.body.fullname) {
      admin.fullname = req.body.fullname;
    }
    if (req.body.role) {
      admin.role = req.body.role;
    }
    if (req.body.email) {
      admin.email = req.body.email;
    }

    const updatedAdmin = await admin.save();

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const logoutAdmin = asyncHandler(async(req, res)=> {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({message: "logout Successful"});
})


module.exports = {
  register,
  login,
  getAdmin,
  deleteAdmin,
  getAdmins,
  updateAdmin,
  logoutAdmin
};
