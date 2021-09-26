const express =require('express')
const mongoose = require ('mongoose');
const Router=express.Router();
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/userModel');

//register
Router.post('/register',async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        if(!name||!email||!password){
            return res.status(400).json({msg:"please fill the all fields"})
        }

        const user = await userSchema.findOne({email});
        if(user){
            return res.status(400).json({msg:"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)
        const newUser = await new userSchema({
            name,
            email,
            password:hash
        })
        newUser.save();
        res.json(newUser)
        if(password.length<=3){
            return res.status(400).json({msg:"please fill the strong password"})
        }
          res.json("sucessfully registered")
        
    } catch (error) {
        
    }
})

// login
Router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    if(email.length===0||password.length===0){
        return res.status(400).json({msg:"please fill the fields"})
    }
    //  we want to search

    const user = await userSchema.findOne({email});
    if(!user){
        return res.status(400).json({msg:"email is invalide"})
    }
   
    //  we want to compare the existing password that already created
    // in register, with the password that we put in login

    const match = await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(400).json({msg:"incorrect password"})
    }

    // if login in sucessfull

    const payload ={id:user._id,name:user.name,}
    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:'1d'
    })
    res.json({
        token,
        user:{
            name:user.name,
            email:user.email,
            id:user._id
        }
    })

})

module.exports = Router;