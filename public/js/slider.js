$(function() {
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
		sendToServer($('#move_forward').text(), $('#power_value').val());
		lastCmd = "MOVE FORWARD";
   	        socket.emit('motorSet', lastCmd);
    });  
    $('#move_reverse').click(function(){
		sendToServer($('#move_reverse').text(), $('#power_value').val());
		lastCmd = "MOVE REVERSE";
	        socket.emit('motorSet',lastCmd);
    }); 
    $('#move_stop').click(function(){
		sendToServer($('#move_stop').text(), $('#power_value').val());
		lastCmd = "STOP";
	        socket.emit('motorSet',lastCmd);
    });
    $('#turn_left').click(function(){
		sendToServer($('#turn_left').text(), $('#power_value').val());
		lastCmd = "TURN LEFT";
	        socket.emit('motorSet',lastCmd);
    });
    $('#spin_left').click(function(){
		sendToServer($('#spin_left').text(), $('#power_value').val());
		lastCmd = "SPIN LEFT";
	        socket.emit('motorSet',lastCmd);
    });
    $('#turn_right').click(function(){
		sendToServer($('#turn_right').text(), $('#power_value').val());
		lastCmd = "TURN RIGHT";
	        socket.emit('motorSet',lastCmd);
    });
    $('#spin_right').click(function(){
		sendToServer($('#spin_right').text(), $('#power_value').val());
		lastCmd = "SPIN RIGHT";
	        socket.emit('motorSet',lastCmd);
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

// other stuff slider

        var $document = $(document);
        var selector = '[data-rangeslider]';
        var $element = $(selector);

        // For ie8 support
        var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

        // Example functionality to demonstrate a value feedback
        function valueOutput(element) {
            var value = element.value;
            var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
            output[textContent] = value;
        }

        $document.on('input', 'input[type="range"], ' + selector, function(e) {
            valueOutput(e.target);
        });

        // Basic rangeslider initialization
        $element.rangeslider({

            // Deactivate the feature detection
            polyfill: false,

            // Callback function
            onInit: function() {
                valueOutput(this.$element[0]);
            },

            // Callback function
            onSlide: function(position, value) {
                console.log('onSlide');
                console.log('position: ' + position, 'value: ' + value);
            },

            // Callback function
            onSlideEnd: function(position, value) {
                console.log('onSlideEnd');
                console.log('position: ' + position, 'value: ' + value);
            }
        });

    });
