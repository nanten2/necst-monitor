var ros = new ROSLIB.Ros({url : "ws://" + "192.168.100.183" + ":9000"});

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

var topic_data = new ROSLIB.Topic({
    ros : ros,
    name : "/topic_record",
    messageType : "std_msgs/String"
});

var name_array = []
topic_data.subscribe(function(message) {
    console.log(message)
    console.log(message.data)
    var json = JSON.parse(message.data);
    console.log(json)
    for(name in json){
	if (name_array.includes(name)){
	    ;
	} else if (!name_array.includes(name)){
	    console.log("add");
	    add_table([name]);
	}else{};
	//try{
	target = document.getElementById(name);
	try{
	    json[name] = Number(json[name]).toFixed(4);
	}catch(e){}
	target.innerHTML = json[name];
	var dt = new Date()
	now = ("00"+dt.getHours()).slice(-2)+":"+("00"+dt.getMinutes()).slice(-2)+":"+("00"+dt.getSeconds()).slice(-2)
	target = document.getElementById(name+"_time")
	target.innerHTML = now;    
	//}catch(e){};
	name_array.push(name)
    }
});

/*
document.getElementById("obs_box").style.display = "block";
document.getElementById("obs_box_one").style.display = "none";
*/
var cl = document.getElementsByClassName("btn");
for (i=0;i < cl.length;i++){
    cl[i].onclick = function(){
        console.log(this.id);
        writefunction(this.id);
    };
};


function writefunction(id){
    var key = id.split("_")[0];
    var value = id.split("_")[1];
    var dt = new Date();
    now = dt.getTime()/1000.;
    
    if (key=="queue"){
	if (value=="start"){
	    param = true
	}else if(value=="stop"){
	    param = false
	}else{param = ""}
	console.log(value)
	msg = new ROSLIB.Message({data:param, from_node:"web", timestamp:now});
	queue.publish(msg)
    }else{};
};

function add_table(data){
    //data = [name, frame]
    var tbl = document.getElementById("data_table");    
    var newRow = tbl.insertRow();
    for (j = 0; j < tbl.rows[0].cells.length-1; j++) {
	var newCell = newRow.insertCell();	
	newCell.innerHTML = data[j];
	if(j==0){
	    $(newCell).addClass("test");
	}
    };
    newCell.innerHTML = '<p id="'+data[0]+'"></p>';
    var newCell = newRow.insertCell();
    newCell.innerHTML = '<p id="'+data[0]+'_time"></p>';
    //console.log(document.getElementById(data[0]));
    ob = document.getElementById('data_table').rows[0].cells;
    for(i=0;i<ob.length;i++) ob[i].className='topic';
    //console.log(document.getElementsByClassName("red"));

};

function del_table(num){
    var tbl = document.getElementById("data_table");
    tbl.deleteRow(num+2);
}
		
/*
try{
    var camera = document.getElementById("camstream");
    camera.innerHTML = '<img style="-webkit-user-select: none;" src="http://192.168.101.153:10000/stream?topic=/cv_camera_node/image_raw" width="292" height="130">';
    //origin --> w292,h219;
}catch(e){
}
*/

