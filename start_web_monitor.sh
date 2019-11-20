#! /bin/bash

export ROS_MASTER_URI=http://172.20.0.21:11311
export ROS_IP=`hostname -I | cut -d' ' -f1`
cd launch
roslaunch S_monitor.launch
