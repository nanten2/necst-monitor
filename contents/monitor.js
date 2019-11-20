/*initialize*/

/*
var random = Math.random();
aa = parseInt(random*5);
bb = ["Hello my master.", "Fight~~", "Happy Day!!", "Maybe Sleepy??", "Yes, we can."];
document.getElementById("asobi").innerText = bb[aa]
*/

var ros = new ROSLIB.Ros({url : "ws://" + "192.168.101.15" + ":9000"});

ros.on("connection", function() {console.log("websocket: connected"); });
ros.on("error", function(error) {console.log("websocket error; ", error); });
ros.on("close", function() {console.log("websocket: closed");});

function sleep(waitsecond, callback){
    var time_count = 0;
    var id = setInterval(function(){
	time_count ++;
	if (time_count >=waitsecond){
	    clearInterval(id)
	    if (callback){
		callback()
	    }    
	}else{};
    },1000);
}
    
var ls = new ROSLIB.Topic({
    ros : ros,
    name : "/web_status",
    messageType : "necst/Read_status_msg"
});

var auth = new ROSLIB.Topic({
    ros : ros,
    name : "/web_auth",
    messageType : "necst/String_necst"
});

var dometrack = new ROSLIB.Topic({
    ros : ros,
    name : "/web_dome_track",
    messageType : "necst/Bool_necst",
});

var node = new ROSLIB.Topic({
    ros:ros,
    name:"/web_node",
    messageType:"necst/Status_node_msg"
});

var alert = new ROSLIB.Topic({
    ros:ros,
    name:"/web_alert",
    messageType:"necst/String_necst"
});

var timer = new ROSLIB.Topic({
    ros:ros,
    name:"/web_timer",
    messageType:"necst/Status_timer_msg"
});

var obs = new ROSLIB.Topic({
    ros:ros,
    name:"/web_obs",
    messageType:"necst/Status_obs_msg"
});

var next_obs = new ROSLIB.Topic({
    ros:ros,
    name:"/web_next_obs",
    messageType:"necst/String_necst"
});

var weather_humi24 = new ROSLIB.Topic({
    ros:ros,
    name:"/web_humi24",
    messageType:"necst/Float64_list_msg"
});

var weather_wind24 = new ROSLIB.Topic({
    ros:ros,
    name:"/web_wind24",
    messageType:"necst/Float64_list_msg"
});

/*
var ondo = new ROSLIB.Topic({
    ros : ros,
    name : "/outer_ondotori",
    messageType : "ondo/tr7nw_values"
});
*/



ls.subscribe(function(message) {
    for( name in message){
	if (name=="Current_Az"||name=="Current_El"){
	    message_e=(parseFloat(message[name])/3600.).toFixed(3)
	}else if (name=="Command_Az"||name=="Command_El"){
	    message_e=parseFloat(message[name]).toFixed(3)
	}else if (name=="Current_Dome"){
	    message_e=parseFloat(message[name]).toFixed(2)	    
	}else if (typeof(message[name])=="number"){
	    message_e=parseFloat(message[name]).toFixed(2)}
	else{
	    message_e=message[name]
	}
	if(name=="Current_M4"){
	    if(message_e=="IN"){
		message_e = "NAGOYA"
	    }else if(message_e=="OUT"){
		message_e = "SMART"
	    }else{};
	}else if(name=="LST"){
	    lst_h = parseInt(message_e/3600);
	    lst_m = parseInt((message_e%3600)/60);
	    lst_s = (message_e%3600)%60;
	    message_e = lst_h.toString()+":"+lst_m.toString()+":"+lst_s.toString();
	}else{}
	if(name=="OutTemp"||name=="OutHumi"){
	    $("#"+name+"_box").attr("class", "node_box_blue");
	    try{
	        document.getElementById(name).innerHTML = message_e;
	    }catch(err){}	    
	}else{
	    $("#"+name+"_box").attr("class", "node_box_blue");
	    try{
	        document.getElementById(name).innerHTML = message_e;
	    }catch(err){}
	}
	if(name == "WindSp"){
	    if (message_e > 20){
		$("#WindSp_box").attr("class", "node_box_red")}else if(message_e > 15){
		    $("#WindSp_box").attr("class", "node_box_yellow")}else{
			$("#WindSp_box").attr("class", "node_box_blue")
		    }
	}else if (name == "Rain"){
	    if (message_e > 5){
		$("#Rain_box").attr("class", "node_box_yellow")}else{
		}
	}else{
	}
    }
});

node.subscribe(function(message){
    msg = message["from_node"].toString();
    data = message["active"]
    //console.log("msg, data : ", msg,data)
    if (data==true){
	document.getElementById(msg);
	$("#"+msg).attr("class", "node_box_blue")
    }else if(data==false){
	$("#"+msg).attr("class", "node_box_red")
    }else{
	console.log("error")
    }
});


/*
ondo.subscribe(function(key){
    console.log(key)
    for( name in key){
	try{
	    if (name == "ch1_value"){
		document.getElementById("OutTemp").innerHTML = key[name];
	    }else if(name == "ch2_value"){
		document.getElementById("OutHumi").innerHTML = key[name];
		if (key[name] > 80){
		    $("#OutHumi").attr("class", "emergency");
		}else if(key[name] > 60){
		    $("#OutHumi").attr("class", "warning");
		}else{
		    $("#OutHumi").attr("class", "nomal");
		}
	    }else{
	    }
	}catch(e){
	}
    }
});
*/			    

auth.subscribe(function(message) {
    document.getElementById("Authority2").innerHTML = message.data
});

dometrack.subscribe(function(message){
    document.getElementById("Dome_Track").innerHTML = message.data;
});

/*
$(".btn").on("click", function(e){
    var id =  $(this).attr("id");
    PubMotorValues(id);
    console.log("id", id);
})
*/

var humi = [10]*24;
var wind = [10]*24;
var start = ""
weather_humi24.subscribe(function(message){
    humi = message.data
    //weather_monitor(snapshot.val()["wind24"],"wind");
});
weather_wind24.subscribe(function(message){
    wind = message.data
    //weather_monitor(snapshot.val()["wind24"],"wind");
    var date = new Date()
    now = date.getHours()
    if (now != start){
	weather_monitor(humi, wind);
	start = now;	
    }else{};
});


timer.subscribe(function(message){
    for( name in message){    
	try{
	    document.getElementById(name).innerText = message[name]
	}catch(e){
	    //console.log(e);
	}
    }
});


document.getElementById("obs_box").style.display = "block";
document.getElementById("obs_box_one").style.display = "none";
obs.subscribe(function(message){
    for( name in message){    
	    if(name=="active"){
		if(message[name]==true){
		    document.getElementById("obs_box").className="column22-main-sub3-true";
		    document.getElementById("obs_box").style.display = "block";
		    document.getElementById("obs_box_one").style.display = "none";
		}else if(message[name]==false){
		    document.getElementById("obs_box").className="column22-main-sub3";
		}else{
		    console.log("xxxxxxxx")		
		}
	    }else if(name=="timestamp"){
		if(message["active"]==true){
		    if(message[name] != document.getElementById("start_time").innerText){
			document.getElementById("start_time").innerText = message[name]
		    }else{}
		}else if(message["active"]==false){
		    if(message[name] != document.getElementById("end_time").innerText){
			document.getElementById("end_time").innerText = message[name]
		    }else{}
		}else{}		    
	    }else if(name != "current_num" & name != "current_position"){
		if (message[name]!=0||message[name]!=""){
		    try{
			document.getElementById(name).innerText = message[name];
		    }catch(e){
			//console.log(e);
		    }
		    if(message["obsmode"] == "LINECROSS"){
			if(parseInt(message["current_num"]/message["num_on"])%2 == 0){
			    px = parseInt(message["current_num"]%message["num_on"])-parseInt(message["num_on"]/2);
			    py = 0;
			}else{
			    px = 0;
			    py = parseInt(message["current_num"]%message["num_on"])-parseInt(message["num_on"]/2);
			}
			xnum = message["num_on"]
			ynum = message["num_on"]			
		    }else if(message["obsmode"] == "LINEOTF"){
			px = 0;
			py = parseInt(message["current_num"]/message["num_on"])-parseInt(message["num_seq"]/2);
			xnum = message["num_on"]
			ynum = message["num_on"]			
		    }else{
			px = 0;
			py = 0;
			xnum = 2;
			ynum = 2;
		    }

		    //console.log(parseInt(message["current_num"]));
		    //console.log(px, py, xnum, ynum)
		    otf_plot("plot", px, py, xnum, ynum)
		}else{
		    ;
		}
	    }else if(name == "current_num"){
		num = parseInt(message[name]%message["num_on"])
		document.getElementById(name).innerText = num;
	    }else if(name == "next_obs"){
	    }else{
		document.getElementById(name).innerText = message[name];
	    }
	}
});



var weather_monitor = function(humi,wind){
    var dt = new Date();
    hh = parseInt(dt.getUTCHours());
    timelist = [];
    data_humi = [];
    data_wind = [];
    for(var i=1;i<24;i++){
	if(hh+i<24){
	    timelist.push(hh+i);
	    data_humi.push(humi[hh+i]);
	    data_wind.push(wind[hh+i]);
	}else{
	    timelist.push(hh+i-24);
	    data_humi.push(humi[hh+i-24]);
	    data_wind.push(wind[hh+i-24]);
	}
    }
    timelist.push(hh);
    data_humi.push(humi[hh]);
    data_wind.push(wind[hh]);
    new Chart(document.getElementById("w_monitor"), {
	    type: "line",
	    data: {
		labels: timelist,
		datasets: [
			   {
				   label: "weather monitor humi",
				   data: data_humi,
				   borderColor:"#ffdab9",
				   yAxisID: "y-axis-1",
				   }, 
			   {
				   label: "weather monitor wind",
				   data : data_wind,
				   borderColor:"#fafacc",
				   yAxisID: "y-axis-2",
				   },

			   ],
		    },
		options:{
		responsive:true,
		    scales:{
		    yAxes:[{
			    id: "y-axis-1",
				position:"left",
				ticks:{
				min:0,
				    max:100,
				    },
				scaleLabel:{
				display:true,
				labelString:"humidity [%]",
				    fontsize:18,
				    }

			},{
			    id: "y-axis-2",
				position:"right",
				ticks:{
				min:0,
				    max:30,
				    },
				scaleLabel:{
				display:true,
				    labelString:"wind speed [km/s]",
				    fontsize:20,
				    }
			}]
			}
		    },
		});
};

var otf_plot = function(id, px, py, xnum, ynum){
    data = [{
	    x:px,
	    y:py,
	}
    ]

    new Chart(document.getElementById(id), {
	    type: "bubble",
	    data: {
		labels: "OTF_plot",
		datasets: [{
			label: "current_position",
			data: data,
		    }]
	    },
	    options:{
		scales:{
		    xAxes:[{
			    type:"linear",
			    position:"bottom",
			    ticks:{
				min:-parseInt(xnum/2),
				max:parseInt(xnum/2),
			    }
			}],
		    yAxes:[{
			    ticks:{
				min:-parseInt(ynum/2),
				max:parseInt(ynum/2),
			    }
			}]
		}
	    }
	});
};



var cl = document.getElementsByClassName("btn");
for (i=0;i < cl.length;i++){
    cl[i].onclick = function(){
        console.log(this.id);
        writefunction(this.id);
    };
};


var queue = new ROSLIB.Topic({
    ros : ros,
    name : "/web_queue",
    messageType : "necst/String_necst"
});

function writefunction(id){
    var key = id.split("_")[0];
    var value = id.split("_")[1];
    var dt = new Date();
    now = dt.getTime()/1000.;
    
    if (key=="queue"){
	console.log(value)
	msg = new ROSLIB.Message({data:value, from_node:"web", timestamp:now});
	queue.publish(msg)
    }else{};
};
    
/*
try{
    var camera = document.getElementById("camstream");
    camera.innerHTML = '<img style="-webkit-user-select: none;" src="http://192.168.101.153:10000/stream?topic=/cv_camera_node/image_raw" width="292" height="130">';
    //origin --> w292,h219;
}catch(e){
}
*/

