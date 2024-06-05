const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    //   if (!name || !email || !password) {
    //     throw new BadRequestError("Please provide name, email and password");
    //   }
    const user = await User.create({...req.body });
    const token = user.createJWT()
    // authentication token
    res.status(StatusCodes.CREATED).json({ user:{name: user.name },token });
};

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email|| !password) throw new BadRequestError("Please provide email and password")
    const user = await User.findOne({email})
    // if email does not exist
    if(!user) throw new UnauthenticatedError('Invalid credentials')
    // if password is not correct
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid credentials')
    // if password is correct generate JWT
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
};




module.exports = { register, login };
