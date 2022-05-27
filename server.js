require("dotenv").config();
require("./config/database").connect()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const userFollow = require("./models/userFollow");

app.post("/:user_id/follow", async (req,res)=>{
    const user_id = req.params.user_id;
    const followed_by = JSON.parse(req.headers["user"]).user_id;
    const isFollowed = await userFollow.findOne({
        user_id:user_id,
        followed_by:followed_by
    });
    if(isFollowed){
        res.status(200).send("already followed!");
    }else{
        await userFollow.create({
            user_id:user_id,
            followed_by:followed_by
        }).then(res.status(200).json("followed successfully")).catch(res.status(500).json("something went wrong"));
    }
});

app.post("/:user_id/unfollow", async (req,res)=>{
    const user_id = req.params.user_id;
    const followed_by = JSON.parse(req.headers["user"]).user_id;
    const isFollowed = await userFollow.findOne({
        user_id:user_id,
        followed_by:followed_by
    });
    if(!isFollowed){
        res.status(200).send("already unfollowed!");
    }else{
        await userFollow.deleteMany({
            user_id:user_id,
            followed_by:followed_by
        }).then(res.status(200).json("unfollowed successfully")).catch(res.status(500).json("something went wrong"));
    }
})

app.get("/:user_id/followers", async (req,res)=>{
    try{
        const followers = await userFollow.find({
            user_id:req.params.user_id,
        });
        res.status(200).send(followers);
    } catch {
        res.status(500).json("something went wrong");
    }
})

app.get("/:user_id/following", async (req,res)=>{
    try{
        const following = await userFollow.find({
            followed_by:req.params.user_id,
        });
        res.status(200).send(following);
    } catch {
        res.status(500).json("something went wrong");
    }
})

const port = process.env.PORT || 4002;

app.listen(port, ()=>{
    console.log("User info service listening on port "+ port);
})