const { GoogleUser } = require("../model/GoogleUser");
const { User } = require("../model/User");

const handleLogin = async (req, res) => {
  const userData = req.body;
  let googleUser = await GoogleUser.findOne({ googleId: userData.googleId });
  if (!googleUser) {
    googleUser = new GoogleUser(userData);
    await googleUser.save();
  }
  let user = await User.findOne({ email: userData.email });
  if (!user) {
    const user = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      profilePicture: userData.profilePicture,
      googleUser: googleUser._id,
      socialType: "google",
    });
    await user.save();
  } else if (!user.googleUser) {
    user.googleUser = googleUser._id;
    await user.save();
  }
  const token = user.generateAuthToken();
  res.status(200).json({ token });
};

module.exports = { handleLogin };
