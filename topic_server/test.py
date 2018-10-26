import rospy
import time
from std_msgs.msg import Float64
import sys

arg = sys.argv

rospy.init_node(arg[1])

pub = rospy.Publisher(arg[1], Float64, queue_size=1)
while not rospy.is_shutdown():
    pub.publish(time.time())
    time.sleep(1)
