import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";

// api/user/
export const registerUser = async (req, res) =>
{
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
}

// api/user/login
export const authUser = async (req, res) =>
{
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        // throw new Error("Invalid Email or Password");
        res.status(401).json("Invalid Email or Password");
    }
}

// api/user/?search=mayank
export const allUsers = async (req, res) =>
{
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
    // res.send(users);
}