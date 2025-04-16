const Router = require('express').Router()
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../models/Users')
const fetchUser = require('../middleware/FetchUser')
const JWT_SECRET = process.env.JWT_SECRET

Router.post('/createUser',[
    body('phone', 'Enter a valid phone number').isLength({min: 10}),
    body('password', 'Password must be at least 5 characters').isLength({min: 5}),
], async(req, res) => {
    const {phone, password} = req.body
    const errors = validationResult(req)
    // If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
        
    try {
        // Check whether the username already exists
        if(await Users.findOne({phone:phone})) {
            return res.status(400).json({error: 'Phone number already exists'})
        }

        // Hash the password
        const secPass = await bcrypt.hash(password, await bcrypt.genSalt(10))
        
        await Users.create({
            phone: phone,
            password: secPass
        }).then(user =>{
            res.json(user)
            console.log("User created successfully!")
        }
        ).catch(err => {
            console.log(err.errmsg)
            res.status(500).json({error: 'Internal server error'})
        })
        // Create an authorization token using jsonwebtoken
        const authToken = jwt.sign({ user: { id: Users.id } }, JWT_SECRET)
    }catch (error) {
        console.log(error.message);
    }
})
Router.post('/login', [
    body('phone', 'Enter a valid phone number').isLength({min: 10}),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req)

    // If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {phone, password} = req.body //deconstructor
    try {
        let user = await Users.findOne({phone})
        if(!user) {
            return res.status(400).json({error: "Invalid credentials"})
        }
        const passComp = await bcrypt.compare(password, user.password)
        if(!passComp) {
            return res.status(400).json({error: "Invalid credentials"})
        }

        // Create an authorization token using jsonwebtoken
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({authToken})
        console.log("Login successful!");
        
    } catch (error) {
        res.send({error: error.message})
    }
})

//get user details after login
Router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await Users.findById(userId).select("-password")
        if(!user) {
            return res.status(404).send({error: "User not found!"})
        }
        res.send(user)
    } catch (error) {
        res.status(500).send({error: "Internal server error!"})
    }
})
module.exports = Router