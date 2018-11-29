$(function(){
	var socket = io.connect();
	
 	var lastCmd = "BREAK"; //default
    //sending command to server
    function sendToServer( name, power){
		socket.json.emit('emit_from_client', {
			name: name,
			power: power,
		});
		console.log(name + ": power:" + power);
	}
	
	var slider1 = document.getElementById("vslider");
	var output1 = document.getElementById("vvalue");
	output1.innerHTML = slider1.value;

	slider1.oninput = function() {
		output1.innerHTML = this.value;
		console.log(slider1.id + " " + this.value);
		socket.emit('emit_client_vslider', { power : this.value});
	}

	var slider2 = document.getElementById("hslider");
	var output2 = document.getElementById("hvalue");
	output2.innerHTML = slider2.value;

	slider2.oninput = function() {
		output2.innerHTML = this.value;
		console.log(slider2.id + " " + this.value);
		socket.emit('emit_client_hslider', { power : this.value});
	}
	
	
	
	//motorSet from server
	socket.on('motorSet', function(data){
		$("#lastCmd").html("")
                $('#lastCmd').append(data);
	});
	// distance
	socket.on('proximity', function(data){
	//	console.log("length : " + data);
		$('#distance').html("");
		$('#distance').append(data.cm+" "+"cm");
	});
	// wifi status
	socket.on('wifi', function(data){
		$("#wifi").html("");
		$("#wifi").append(data+"%"+"\r");
	});
	// are we online
	socket.on('online', function(data){
		$("#online").html("");
		$("#online").append(data);
	});
	// cpu temp
	socket.on('cpu_temp', function(data){
		$("#cpu_temp").html("");
		$("#cpu_temp").append(data);
	});

// BUTTONS 
     $('#move_forward').click(function(){
		sendToServer($('#move_forward').text(), $('#pvalue').val());
		lastCmd = "MOVE FORWARD";
	    socket.emit('motorSet', lastCmd);
    });  
    $('#move_reverse').click(function(){
		sendToServer($('#move_reverse').text(), $('#pvalue').val());
		lastCmd = "MOVE REVERSE";
	    socket.emit('motorSet',lastCmd);
    }); 
    $('#move_stop').click(function(){
		sendToServer($('#move_stop').text(), $('#pvalue').val());
		lastCmd = "BREAK";
	    socket.emit('motorSet',lastCmd);
    });
    $('#turn_left').click(function(){
		sendToServer($('#turn_left').text(), $('#pvalue').val());
		lastCmd = "TURN LEFT";
	    socket.emit('motorSet',lastCmd);
    });
    $('#spin_left').click(function(){
		sendToServer($('#spin_left').text(), $('#pvalue').val());
		lastCmd = "SPIN LEFT";
	    socket.emit('motorSet',lastCmd);
    });
    $('#turn_right').click(function(){
		sendToServer($('#turn_right').text(), $('#pvalue').val());
		lastCmd = "TURN RIGHT";
	    socket.emit('motorSet',lastCmd);
    });
    $('#spin_right').click(function(){
		sendToServer($('#spin_right').text(), $('#pvalue').val());
		lastCmd = "SPIN RIGHT";
	    socket.emit('motorSet',lastCmd);
    });
    $('#hreset').click(function(){
                console.log("Hservo reset");
                socket.emit('hreset');
    });

// LED
    $('#turnOn').click(function(){
		socket.emit('turnOn');
    });
    $('#turnOff').click(function(){
		socket.emit('turnOff');
    });
// Overlay
	$('#overlay_on').click(function(){
		socket.emit('overlay_on');
    });
    $('#overlay_off').click(function(){
		socket.emit('overlay_off');
    });
// Face Object Detection
	$('#face_detection_on').click(function(){
		socket.emit('face_detection_on');
    });
    $('#face_detection_off').click(function(){
		socket.emit('face_detection_off');
    });
    
// Key events
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
		sendToServer($('#move_forward').text(), $('#power_value').val());
                lastCmd = "MOVE FORWARD";
                socket.emit('motorSet',lastCmd);
    }
    else if (e.keyCode == '40') {
		sendToServer($('#move_reverse').text(), $('#power_value').val());
                lastCmd = "MOVE REVERSE";
                socket.emit('motorSet',lastCmd);
    }
    else if (e.keyCode == '37') {
		sendToServer($('#turn_left').text(), $('#power_value').val());
                lastCmd = "TURN LEFT";
                socket.emit('motorSet',lastCmd);
    }
   else if (e.keyCode == '39') {
                sendToServer($('#turn_right').text(), $('#power_value').val());
                lastCmd = "TURN RIGHT";
                socket.emit('motorSet',lastCmd);
    }
   else if (e.keyCode == '13') {
		sendToServer($('#move_stop').text(), $('#power_value').val());
                lastCmd = "BREAK";
                socket.emit('motorSet',lastCmd);
    }
}


});
