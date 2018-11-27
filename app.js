// variables
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var bodyParser = require('body-parser');
var flite = require('flite2');
// pca9685
//var i2cBus = require("i2c-bus");
//var Pca9685Driver = require("pca9685").Pca9685Driver;
var steeringChannel1 = 1; // servo on channel 0
var steeringChannel2 = 0; // servo on channel 1
var pwm;
var motorSet = 'BREAK';
//var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

// leds
//var GPIO = require('onoff').Gpio,
//    led1 = new GPIO(18,'out'),
//    led2 = new GPIO(24,'out');

//var options = {
//    i2c: i2cBus.openSync(1),
//    address: 0x40,
//    frequency: 60,
//    debug: false
//};

// initialize PCA9685 and start loop once initialized
//pwm = new Pca9685Driver(options, function moveServo(err) {
//   if (err) {
//        console.log("[ - PIA - ] [ Error initializing PCA9685 ]");
//        process.exit(-1);
//    }
//    console.log("[ - PIA - ] [ PCA9685 Initialization done ]");
//});

// Init Adruino board
//var five = require("johnny-five");
//var board = new five.Board({
//    repl: false,
//    debug: false
//});

//var devices = {};
//	board.on("ready", function() {
//   	console.log("[ - PIA - ] [ Arduino Board ready ] ");
//devices.proximity = new five.Proximity({
//	controller: "HCSR04",
//	freq: "200",
//	pin: "A0"
//	});
//devices.M1 = new five.Motor({
// 	pins: { pwm: 11},
// 	register: { data: 8, clock: 4, latch: 12 },
// 	bits: { a: 2, b: 3 }
//	});
//devices.M4 = new five.Motor({
//  	pins: { pwm: 5},
//  	register: { data: 8, clock: 4, latch: 12 },
//  	bits: { a: 0, b: 6 }
//	});
//});

// functions
function switchOn() {
    if (led1.readSync() === 1) { 	//check the pin state, if the state is 1 (or on)
		console.log('[ - PIA - ] [ LEDs ] [ Off ]');
		led1.writeSync(0); 				//set pin state to 0 (turn LED off)
		led2.writeSync(0);
	} else {
		console.log('[ - PIA - ] [ LEDs ] [ On ]');
		led1.writeSync(1); 				//set pin state to 1 (turn LED on)
		led2.writeSync(1);
	}
}
function blinkLED() {
	if (led1.readSync() === 0) { 
		led1.writeSync(1);
		led2.writeSync(1);
	} else {
		led1.writeSync(0);
		led2.writeSync(0);
	}
}
//function to stop blinking
function endBlink() { 
		clearInterval(blinkInterval);
		led1.writeSync(0); 
		led2.writeSync(0); 
		led1.unexport(); 
		led2.unexport(); 
}
function hservoReset() {
    console.log("[ - PIA - ] [ HServo Reset]");
    pwm.setPulseLength(steeringChannel1, 1500);
}
function vservoReset() {
    console.log("[ - PIA - ] [ VServo Reset]");
    pwm.setPulseLength(steeringChannel2, 1500);
}
function hservoMove(pulse) {
    if (pulse == null) {
     console.log("[ - PIA - ] [ HServo Move] [pulse undefined]");
    } else {
    console.log("[ - PIA - ] [ HServo Move]" + " " + "[" + pulse + "]");
    pwm.setPulseLength(steeringChannel1, pulse);
    }
}
function vservoMove(pulse) {
    if (pulse == null) {
     console.log("[ - PIA - ] [ VServo Move] [pulse undefined]");
    } else {
     console.log("[ - PIA - ] [ VServo Move]" + " " + "[" + pulse  + "]");
     pwm.setPulseLength(steeringChannel2, pulse);
    }
}
// OpenCV
function ShowFaceOn() {
    var child_process = require('child_process');
    console.log('[ - PIA - ] [ Face ] [ Off ]');
    child_process.exec('v4l2-ctl --set-ctrl=object_face_detection=1', function (err, data) {
    });
}
function ShowFaceOff() {
    var child_process = require('child_process');
    console.log('[ - PIA - ] [ Face ] [ Off ]');
    child_process.exec('v4l2-ctl --set-ctrl=object_face_detection=0', function (err, data) {
    });
}
function overlayOn() {
    var child_process = require('child_process');
    console.log('[ - PIA - ] [ Overlay ] [ On ]');
    child_process.exec('v4l2-ctl --set-ctrl=text_overlay=1', function (err, data) {
    });
}
function overlayOff() {
    var child_process = require('child_process');
    console.log('[ - PIA - ] [ Overlay ] [ Off ]');
    child_process.exec('v4l2-ctl --set-ctrl=text_overlay=0', function (err, data) {
    });
}
// Johnny Five
function moveStop() {
    console.log("[ - PIA - ] [ Break ]");
    motorSet = 'BREAK';
    devices.M1.stop();
    devices.M4.stop();
}
function moveForward(speed) {
    if (( dist < 15) && (motorSet == 'MOVE FORWARD')) {
       moveStop();
       console.log('[ - PIA - ] [ TOO CLOSE ] ');
    } else {
    	console.log("[ - PIA - ] [ Move Forward ]" + " " + "[" + speed + "]");
    	motorSet = 'MOVE FORWARD';
    	devices.M1.rev(speed);
    	devices.M4.rev(speed);
	}
}
function moveReverse(speed) {
    console.log("[ - PIA - ] [ Move Reverse ]" + " " + "[" + speed + "]");
    motorSet = 'MOVE REVERSE';
    devices.M1.fwd(speed);
    devices.M4.fwd(speed);
}
function turnLeft(speed) {
    console.log("[ - PIA - ] [ Turn Left ]" + " " + "[" + speed + "]");
    motorSet = 'TURN LEFT';
    devices.M1.fwd(speed);
    devices.M4.rev(speed / 2);
}
function turnRight(speed) {
    console.log("[ - PIA - ] [ Turn Right ]" + " " + "[" + speed + "]");
    motorSet = 'TURN RIGHT';
    devices.M1.rev(speed / 2);
    devices.M4.fwd(speed);
}
function spinLeft(speed) {
    console.log("[ - PIA - ] [ Spin Left ]" + " " + "[" + speed + "]");
    motorSet = 'SPIN LEFT';
    devices.M1.fwd(speed);
    devices.M4.stop();
}
function spinRight(speed) {
    console.log("[ - PIA - ] [ Spin Right ]" + " " + "[" + speed + "]");
    motorSet = 'SPIN RIGHT';
    devices.M4.fwd(speed);
    devices.M1.stop();
}

// Interprets and acts on a given command (expects strings split by "-")
function processRobotCommand (received) {
  var p = JSON.parse(received);
  if (p.name == 'Forward') {
	  moveForward(p.power);
  }
  if (p.name == 'Backward') {
	  moveReverse(p.power);
  }
  if (p.name == 'Break') {
	  moveStop();
  }
  if (p.name == 'Turn Left') {
	  turnLeft(p.power);
  }
  if (p.name == 'Turn Right') {
	  turnRight(p.power);
  }
  if (p.name == 'Spin Left') {
	  spinLeft(p.power);
  }
  if (p.name == 'Spin Right') {
	  spinRight(p.power);
  }
}

// Initialize express and server
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(8080);
console.log("[ - PIA - ] [ Starting web server, listening on *:8080 ]");

// to support JSON-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set '/public' as the static folder. Any files there will be directly sent to the viewer
app.use(express.static(__dirname + '/public'));

// Set index.html as the base file
app.get('/', function (req, res) {
  	res.sendfile(__dirname + '/index.html');
});

app.post('/text2speak', function(req,res) {
var text2speak = req.body.text2speak;
var desired = text2speak.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

// empty string?
if (text2speak == null) {
	console.log("[ - PIA - ] [ speak ] : [ empty input found ]");
} else {
	flite(function (err, speech) {
		if (err) { return console.error(err) }
			speech.say(desired, function (err) {
		    if (err) { return console.error(err) }
		    console.log("[ - PIA - ] [ Text has been spoken ]" + "[" + desired + "]");
		    res.end();
			});
		});
	}
});

// allow commands to be send via http call - GET only accepts command
app.get('/command/', function (req, res) {
res.send('command: ' + req.query.command);
});
// POST can look for timestamp(ms), command, and status
app.post('/command/', function (req, res) {
});

// socket.io

var numClients = 0;

io.on('connection', function(socket) {
    numClients++;
    io.emit('stats', { numClients: numClients });
	setInterval(function(){
		io.emit('motorSet', motorSet);
	}, 2000);
    console.log('[ - PIA - ] [ Connected clients:', numClients +']');
    // button pushed
    socket.on('emit_from_client', function(data){
		//console.log(data);
		var receive = JSON.stringify(data);
//		console.log(receive);
		processRobotCommand(receive);
	});
    // pslider change
    socket.on('emit_from_client_pw', function(data){
		var receive = JSON.stringify(data);
                var p = JSON.parse(receive);
                var speed = p.power;
//		console.log("pslider: [" + receive + "]");
		socket.broadcast.emit('emit_from_server_pw', receive);
	});
	// hslider change
    socket.on('emit_from_client_hw', function(data){
		var receive = JSON.stringify(data);
                var p = JSON.parse(receive);
                var pulse = p.power;
//		console.log("hslider: [" + receive + "]");
		//socket.broadcast.emit('emit_from_server_hw', receive);
		//processRobotCommand(receive);
   		//console.log(pulse);
		hservoMove(pulse);
	});
// vslider change
    socket.on('emit_from_client_vw', function(data){
		var receive = JSON.stringify(data);
                var p = JSON.parse(receive);
                var pulse = p.power;
		//console.log("vslider: [" + receive + "]");
		//socket.broadcast.emit('emit_from_server_hw', receive);
		//processRobotCommand(receive);
   		//console.log(pulse);
		vservoMove(pulse);
	});
    socket.on('hreset', function(){
           hservoReset();
    });
    socket.on('vreset', function(){
            vservoReset();
    });
	// LEDs
    socket.on('switchOn', function() {
	    switchOn();
    });
    socket.on('blinkLED', function() {
	    blinkLED();
    });
    socket.on('endBlink', function() {
	    endBlink();
    });
    // Face/Objekt Detection
    socket.on('face_detection_on', function() {
        ShowFaceOn();
    });
    socket.on('face_detection_off', function() {
        ShowFaceOff();
    });
    // Overlay
    socket.on('overlay_on', function() {
        overlayOn();
    });
    socket.on('overlay_off', function() {
        overlayOff();
    });

// read in sensor data, pass to browser
    //devices.proximity.on("data", function() {
    //socket.emit('proximity', { cm: this.cm.toFixed(1) });
    //dist = this.cm.toFixed(1);
    //if (( this.cm.toFixed(0) < 10) && (motorSet == 'MOVE FORWARD')) {
    //   moveStop();
    //   console.log('[ - Pia - ] [ TOO CLOSE ] ');
	//}
    //});
    socket.on('disconnect', function() {
        numClients--;
        io.emit('stats', { numClients: numClients });
        console.log('[ - PIA - ] [ Connected clients:', numClients +']');
    });
// get WiFi Status
function wifi() {
        var child_process = require('child_process');
        child_process.exec('iwconfig wlan0|grep Link|cut -d"=" -f3|cut -d" " -f1| cut -d"/" -f1', function (err, data) {
        //console.log(data);
        socket.emit('wifi',  data);
        });
}
function online() {
	var child_process = require('child_process');
	child_process.exec('uptime | cut -d" " -f4-5| cut -f1 -d","', function (err, data) {
	//console.log(data);
	socket.emit('online', data );
	});
}
function cpu_temp() {
	var child_process = require('child_process');
	child_process.exec("/opt/vc/bin/vcgencmd measure_temp | awk -F '=' '{print $2}'", function (err, data) {
	socket.emit('cpu_temp', data );
	});
}
// Send current time every 10 secs
setInterval(wifi, 2000);
setInterval(online, 2000);
setInterval(cpu_temp, 2000);
//setTimeout(endBlink, 10000); //stop blinking after 10 seconds 
});

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  pwm.dispose();
  led1.unexport();
  led2.unexport();
  child_process.kill();
  process.exit();
});
