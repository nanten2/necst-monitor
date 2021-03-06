#!/usr/bin/env python3

import rospy
import rosnode
import time
from necst.msg import String_list_msg

rospy.init_node("topic_publisher")

pub_name = rospy.get_published_topics()
#node_name = rosnode.get_node_names()

name_list = []
value_list = []

def create_list():
    name_list = []
    value_list = []
    pub_name = rospy.get_published_topics()
    for name, value in pub_name:
        if not "/XFFTS" in name and not "/tp_" in name:
            name_list.append(name)
            value_list.append(value)
    print(name_list)
    return name_list, value_list

pub1 = rospy.Publisher("tp_name",String_list_msg, queue_size=1)
pub2 = rospy.Publisher("tp_value",String_list_msg, queue_size=1)
while not rospy.is_shutdown():
    ret1, ret2 = create_list()
    pub1.publish(data = ret1)
    time.sleep(0.1)
    pub2.publish(data = ret2)
    time.sleep(30)
