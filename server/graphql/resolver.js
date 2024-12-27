const bcrypt = require("bcrypt");
const User = require("../models/User");

const resolvers = {
  Query: {
    users: async () => {
      return await User.find(); // Fetch all users
    },
  },
  Mutation: {
    signup: async (_, { fullName, userId, email, password, address }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ fullName, userId, email, password: hashedPassword, address });

      const savedUser = await newUser.save();
      return { message: "User created successfully", user: savedUser };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      return {
        message: "Login successful",
        user: { id: user.id, fullName: user.fullName, email: user.email, address: user.address },
      };
    },
  },
};

module.exports = resolvers;
