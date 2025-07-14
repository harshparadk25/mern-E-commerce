const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../../models/User");




const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  console.log("Received registration body:", req.body);

  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res.json({
        success: false,
        message: "User already exists with this email!",
      });

    const checkUserName = await User.findOne({ userName });
    if (checkUserName)
      return res.json({
        success: false,
        message: "Username is already taken!",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
  console.error("Registration Error Stack:", e);  // More informative
  res.status(500).json({
    success: false,
    message: e.message || "Some error occurred",
  });
}
};



const loginUser = async(req,res)=>{
    const {email,password} = req.body;

    try {
      const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

      const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
  {
    userId: checkUser._id,
    email: checkUser.email,
    role: checkUser.role, 
    userName: checkUser.userName,
    // ✅ include role in token
  },
  'CLEARLY_SECRET_KEY',
  { expiresIn: '60m' }
);

    res
  .cookie("token", token, {
    httpOnly: true,
    secure: true,           
    sameSite: "Lax",      
  })
  .json({
    success: true,
    message: "Logged in successfully",
    user: {
      email: checkUser.email,
      role: checkUser.role,
      id: checkUser._id,
      userName: checkUser.userName,
    },
  });

        
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error",success: false });
    }
}

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });

};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLEARLY_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};


module.exports = {registerUser,loginUser,logoutUser, authMiddleware};