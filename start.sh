#!/bin/bash

NODEPROC="$(ps aux|grep node| awk '{print $2}'|head -n1)"
if [[ $? != 0 ]]; then
sudo kill -9 $NODEPROC
fi

UV4LPROC="$(ps aux|grep uv4l| awk '{print $2}'|head -n1)"
if [[ $? != 0 ]]; then
sudo kill -9 $UV4LPROC
fi
# start u4vl
#uv4l --driver raspicam --auto-video_nr --object-detection --min-object-size 80 80 --main-classifier /usr/share/uv4l/raspicam/lbpcascade_frontalface.xml --object-detection-mode accurate_detection --width 640 --height 480 --framerate 15 --encoding h264 --server-option '--port=9000' --vflip --hflip
uv4l --driver raspicam --auto-video_nr --width 640 --height 480 --framerate 30 --encoding h264 --server-option '--port=9000' 
# start node
nodemon app.js
