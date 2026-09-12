import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://theisig.com/wp-content/uploads/2024/04/649404a4f0a6df7621b33c27_blank-1.png.webp",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
