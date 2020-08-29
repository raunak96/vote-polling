const express = require("express");
const router = express.Router();
const Pusher = require('pusher');
const Vote = require("../models/vote");

var pusher = new Pusher({
	appId: process.env.APP_ID,
	key: process.env.KEY,
	secret: process.env.SECRET,
	cluster: "ap2",
	useTLS: true,
});

router.get("/", async (req, res) => {
	try {
		const votes = await Vote.find();
		return res.json({ success: true, votes });
	} catch (error) {
		return res.status(500).json({success: false, error: error.message});
	}
	
});

router.post("/",async (req,res)=>{
	try {
		let vote = await Vote.findOne({os:req.body.os});
		if(vote){
			vote.points+=1;
			await vote.save();
		}else{
			const newVote = new Vote({points:1, os:req.body.os});
			await newVote.save();
		}
		pusher.trigger("os-poll", "os-vote", {
			points: 1,
			os: req.body.os
		});
	return res.json({success:true, message:'Thanks for your precious vote 😸'});
	} catch (error) {
		return res.status(500).json({success:false,error: error.message});
	}
});

module.exports= router;