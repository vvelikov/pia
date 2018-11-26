$(function(){
  var socket = io.connect();
  	var lastCmd = "BREAK"; //default
    //sending command to server
    function sendToServer( name, power){
		socket.json.emit('emit_from_client', {
			name: name,
			power: power,
		});
		//console.log(name + ": power:" + power);
	}
	
	//power data from server
	socket.on('emit_from_server_pw', function(data){
//		console.log("from_server pw : " + data);
		var power = JSON.parse(data).power;
		$("#pslider").slider("pvalue", power)
        $('#pvalue').val(power);
	});
	//horizontal data from server
	socket.on('emit_from_server_hw', function(data){
//		console.log("from_server hw : " + data);
		var power = JSON.parse(data).power;
		$("#hslider").slider("hvalue", power)
        $('#hvalue').val(power);
	});
	//vertical data from server
	socket.on('emit_from_server_vw', function(data){
//		console.log("from_server vw : " + data);
		var power = JSON.parse(data).power;
		$("#vslider").slider("vvalue", power)
        $('#vvalue').val(power);
	});
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
        socket.emit('hreset');
    });
    $('#vreset').click(function(){
        socket.emit('vreset');
    });

// LED
    $('#switchOn').click(function(){
		socket.emit('switchOn');
    });
    $('#blinkLED').click(function(){
		socket.emit('blinkLED');
	});    
    $('#endBlink').click(function(){
		socket.emit('endBlink');
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
    
// POWER SLIDER
	$("#pslider").slider({
		range: "max",
		min: 0,
		max: 255,
		value: 200,

		//default
		create: function( event, ui ) {
        	$('#pvalue').val(200);
		},
		//change slider
		slide: function( event, ui ) {
        	$('#pvalue').val(ui.value);
			socket.emit('emit_from_client_pw', { power : ui.value });
		},
		//slider change done
		stop: function( event, ui ) {
                        socket.emit('emit_from_client_pw', { power : ui.value });
		}
	});
	//change input field
    $('#pvalue').change( function () {
		$("#pslider").slider("value",this.value)
		socket.emit('emit_from_client_pw', { power : this.value });
    });

// HORIZONTAL SLIDER
	$("#hslider").slider({
		range: "max",
		min: 500,
		max: 2500,
		value: 1500,

		//default
		create: function( event, ui ) {
        	$('#hvalue').val(1500);
		},
		//change slider
		slide: function( event, ui ) {
        	$('#hvalue').val(ui.value);
			socket.emit('emit_from_client_hw', { power : ui.value });
		},
		//slider change done
		stop: function( event, ui ) {
                        socket.emit('emit_from_client_hw', { power : ui.value });
	        }
	});
	//change input field
    $('#hvalue').change( function () {
		$("#hslider").slider("value",this.value)
		socket.emit('emit_from_client_hw', { power : this.value});
    });
    
    	// VERTICAL SLIDER
	$("#vslider").slider({
		orientation: "vertical",
		range: "min",
		min: 500,
		max: 2500,
		value: 1500,

		//default
		create: function( event, ui ) {
        	$('#vvalue').val(1500);
		},
		//change slider
		slide: function( event, ui ) {
        	$('#vvalue').val(ui.value);
			socket.emit('emit_from_client_vw', { power : ui.value});
		},
		//slider change done
		stop: function( event, ui ) {
                        socket.emit('emit_from_client_vw', { power : ui.value });
		}
	});
	//change input field
    $('#vvalue').change( function () {
		$("#vslider").slider("value",this.value)
		socket.emit('emit_from_client_vw', { power : this.value});
    }); 

       $('#text2speak').val('');
       $("#submit").click(function(){
       text2speak=$("#text2speak").val();
      // $.post("http://192.168.0.9:8080/text2speak",{text2speak: text2speak}, function(data){
       $.post("/text2speak",{text2speak: text2speak}, function(data){

                });
       });

// Key events
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
		sendToServer($('#move_forward').text(), $('#pvalue').val());
                lastCmd = "MOVE FORWARD";
                socket.emit('motorSet',lastCmd);
    }
    else if (e.keyCode == '40') {
		sendToServer($('#move_reverse').text(), $('#pvalue').val());
                lastCmd = "MOVE REVERSE";
                socket.emit('motorSet',lastCmd);
    }
    else if (e.keyCode == '37') {
		sendToServer($('#turn_left').text(), $('#pvalue').val());
                lastCmd = "TURN LEFT";
                socket.emit('motorSet',lastCmd);
    }
   else if (e.keyCode == '39') {
                sendToServer($('#turn_right').text(), $('#pvalue').val());
                lastCmd = "TURN RIGHT";
                socket.emit('motorSet',lastCmd);
    }
   else if (e.keyCode == '13') {
		sendToServer($('#move_stop').text(), $('#pvalue').val());
                lastCmd = "BREAK";
                socket.emit('motorSet',lastCmd);
    }
}

});




