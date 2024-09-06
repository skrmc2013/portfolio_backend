import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { Timeline } from "../models/timelineSchema.js";
import ErrorHandler from "../middlewares/error.js";


export const postTimeline = catchAsyncErrors(async (req, res, next) => {
  // Your logic here
  const { title, description, from, to } = req.body;
  const timeline = await Timeline.create({
    title, description, timeline: {from, to}
  });

  res.status(200)
  .json({ 
    success:true,
     message: 'Timeline Added Successfully' 
    });
});

export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {

  const {id} = req.params;
  const timeline = await Timeline.findById(id);
  if(!timeline){
    return next(new ErrorHandler("Timeline Not Found", 404));
  }

  await timeline.deleteOne();
  res.status(200).json({ 
    success: true,
    message: 'Timeline deleted' });
});

export const getAllTimeline = catchAsyncErrors(async (req, res, next) => {
  // Your logic here

  const timelines = await Timeline.find();
  
  res.status(200).json({ 
    success:true, 

    message: 'All timelines retrieved',
  timelines, });
});