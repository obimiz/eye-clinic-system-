import User from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
    try {

        //checking if user already exist
        const { email, password } = req.body

        const user = await User.findOne({
            email: email.toLowerCase()
        }) .select("+password");

        if (!user) return res.status(400).json({
            message: "user not found"
        });

        //compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({
          message: "Invalid credentials"
        });

        res.status(200).json({
          message: "User Logged in",
          user: {
            id: user._id,
            firstName: user.firstName,  
            lastName: user.lastName,
            email: user.email,
            role: user.role, 
          }
        })
        
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error"
      })
        
    }
}

export { registerUser };
export { loginUser };