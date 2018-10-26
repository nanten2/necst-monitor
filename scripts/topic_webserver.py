#!/usr/bin/env python3

import rospy, os, ssl
from http.server import HTTPServer, SimpleHTTPRequestHandler

def kill():
    os.system("kill -KILL " + str(os.getpid()))

os.chdir("/home/amigos/ros/src/necst_monitor/topic_server")
host = 'localhost'
port = 8000
httpd = HTTPServer(("", port), SimpleHTTPRequestHandler)
print("serving at port", port)
httpd.serve_forever()

rospy.init_node("webserver")
rospy.on_shutdown(kill)


