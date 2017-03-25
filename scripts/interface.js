var switchAud1 = new Audio('audio/switch.wav');
var switchAud2 = new Audio('audio/switch.wav');

function switchSound1(){
	switchAud1.play();
}
function switchSound2(){
	switchAud2.play();
}

var pause = false;

var A = 0;
var B = 1;
var NONE = -1;
var END = -2;
var SEC = 1000;
var MIN = 60*SEC;
var HR = 60*MIN;

var timerWait = 5; // Defines amount of milliseconds waited before checking time again

var active = NONE;

var numberOfClicks = 0;

var incrementType = 0;
var inc = 0;

// Represents user-set times for players A & B
var initTimes = [[0, 5, 0], [0, 5, 0]]; 

// Initialize menu highlighting
var timeTypes = ["h", "m", "s"];
document.getElementById("inc" + inc.toString()).classList.add("timeSelectActivated");
document.getElementById("incType" + incrementType.toString()).classList.add("timeSelectActivated");
for (var player = A; player <=B; player++){
	for (var timeType = 0; timeType < 3; timeType++){
		document.getElementById(player.toString() + timeTypes[timeType] + initTimes[player][timeType].toString()).classList.add("timeSelectActivated");
	}
}

var times = [2*SEC,2*SEC];
var previousTimes = [2*SEC, 2*SEC];

function formatTime(x){
	var seconds =(x%MIN);
	var minutes = (x%HR)-seconds;
	var hours = Math.floor((x-minutes-seconds)/HR);
	minutes = Math.floor(minutes/MIN);
	seconds = Math.floor(seconds/SEC);
	
	var milliseconds = x%SEC;
	
	var message = [hours.toString(), minutes.toString(), seconds.toString(), milliseconds.toString()];

	
	while(message[3].length < 3){
		message[3] = "0" + message[3];
	}
	
	for (var i =0; i<3; i++){
		if(message[i].length < 2){
			message[i] = "0" + message[i];
		}
	}
	return message;
}

function selectHour(x, player){
	document.getElementById(player.toString() + "h" + initTimes[player][0].toString()).classList.remove("timeSelectActivated");
	initTimes[player][0] = x;
	document.getElementById(player.toString() + "h" + initTimes[player][0].toString()).classList.add("timeSelectActivated");
	updateDisplays();
}
function selectMinute(x, player){
	document.getElementById(player.toString() + "m" + initTimes[player][1].toString()).classList.remove("timeSelectActivated");
	initTimes[player][1] = x;
	document.getElementById(player.toString() + "m" + initTimes[player][1].toString()).classList.add("timeSelectActivated");
	updateDisplays();
}
function selectSecond(x, player){
	document.getElementById(player.toString() + "s" + initTimes[player][2].toString()).classList.remove("timeSelectActivated");
	initTimes[player][2] = x;
	document.getElementById(player.toString() + "s" + initTimes[player][2].toString()).classList.add("timeSelectActivated");
	updateDisplays();
}

function selectInc(x){
	document.getElementById("inc" + inc.toString()).classList.remove("timeSelectActivated");
	inc = x;
	document.getElementById("inc" + inc.toString()).classList.add("timeSelectActivated");
	updateDisplays();
}

function selectIncType(x){
	document.getElementById("incType" + incrementType.toString()).classList.remove("timeSelectActivated");
	incrementType = x;
	document.getElementById("incType" + incrementType.toString()).classList.add("timeSelectActivated");
	restart();
}

function toggleMenu(){
	document.getElementById("menu").classList.toggle("hiddenMenu");
}

function updateDisplays(){
	var message = formatTime(initTimes[A][0]*HR + initTimes[A][1]*MIN + initTimes[A][2]*SEC);
	document.getElementById("player1time").innerHTML = message[0] + ":" + message[1] + ":" + message[2];
	
	message = formatTime(initTimes[B][0]*HR + initTimes[B][1]*MIN + initTimes[B][2]*SEC);
	document.getElementById("player2time").innerHTML = message[0] + ":" + message[1] + ":" + message[2];
	
	document.getElementById("incrementDisplay").innerHTML = inc.toString() +"s";
	if(inc < 10){
		document.getElementById("incrementDisplay").innerHTML = "0" + document.getElementById("incrementDisplay").innerHTML;
	}

	restart();
}

function gameEnd(){
	if ("vibrate" in navigator) {
		navigator.vibrate([200, 100, 500]);
	}
	pause = false;
	active = -2;
	document.getElementById("pressA").classList.add("pressed");
	document.getElementById("pressB").classList.add("pressed");
	document.getElementById("pauseIcon").classList.remove("fa-pause");
	document.getElementById("pauseIcon").classList.add("fa-play");
}

function countDown(x){
	if(times[x]<=0){
		gameEnd();
		if(x == A){
			document.getElementById("pressA").classList.add("lose");
		} else if(x == B){
			document.getElementById("pressB").classList.add("lose");
		}
	} else {
		if(!pause && (x==active || active == NONE)){
			clicksCopy = numberOfClicks;
			setTimeout(function(){
				// This 'if' statement makes sure that this countdown is cancelled in case the users click twice before 0.1s has passed.
				// This prevents a bug where one user's clock runs down extremely quickly if one presses both buttons rapidly.
				if(clicksCopy == numberOfClicks){ 
					times[x] -= timerWait;
					var newDisplay = formatTime(times[x]);
					if(x==A){
						if(newDisplay[0] == "00"){
							document.getElementById("timeA").innerHTML = newDisplay[1]+":"+newDisplay[2];
						} else {
							document.getElementById("timeA").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
						}
						document.getElementById("milliA").innerHTML = newDisplay[3];
					} else {
						if(newDisplay[0] == "00"){
							document.getElementById("timeB").innerHTML = newDisplay[1]+":"+newDisplay[2];
						} else {
							document.getElementById("timeB").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
						}
						document.getElementById("milliB").innerHTML = newDisplay[3];
					}
					countDown(x);
				}
			},timerWait);
		}
	}
}

function switchClock(x){
	if ((!pause && (active != B && active != END && x==A)) || (pause && active == NONE && x==A)){
		numberOfClicks += 1;
		if(active != NONE && incrementType == 0){
			times[A] += inc*1000
		}
		if(active != NONE && incrementType == 1){
			if(previousTimes[A] - times[A] < inc*1000){
				times[A] = previousTimes[A];
			} else{
				times[A] += inc*1000;
			}
		}
		
		// Small bug fix, where the first two 'actual' presses would allow
		// the countdown to go once after switch is pressed.
		if(numberOfClicks == 2 || numberOfClicks == 3){
			times[A] += timerWait;
		}
		
		previousTimes[A] = times[A];
		active = B;
		switchSound1();
		if(pause) { pause = false; }
		document.getElementById("pauseIcon").classList.add("fa-pause");
		document.getElementById("pauseIcon").classList.remove("fa-play");
		
		document.getElementById("pressB").classList.remove("pressed");
		document.getElementById("pressA").classList.add("pressed");

		if(active != NONE && incrementType == 2){
			var clicksCopy = numberOfClicks;
			setTimeout(function(){
				if(clicksCopy == numberOfClicks){
					countDown(B);
				}
			}, inc*1000);
		} else{
			countDown(B);
		}
	} else if((!pause && (active != A && active != END && x==B )) || (pause && active == NONE && x==B)){
		numberOfClicks += 1;
		if(active != NONE && incrementType == 0){
			times[B] += inc*1000
		}
		if(active != NONE && incrementType == 1){
			if(previousTimes[B] - times[B] < inc*1000){
				times[B] = previousTimes[B];
			} else{
				times[B] += inc*1000;
			}
		}
		
		// Small bug fix, where the first two 'actual' presses would allow
		// the countdown to go once after switch is pressed.
		if(numberOfClicks == 2 || numberOfClicks == 3){
			times[B] += timerWait;
		}
		
		previousTimes[B] = times[B];
		active = A;
		
		switchSound2();
		if(pause) { pause = false; }
		document.getElementById("pauseIcon").classList.add("fa-pause");
		document.getElementById("pauseIcon").classList.remove("fa-play");
		
		document.getElementById("pressA").classList.remove("pressed");
		document.getElementById("pressB").classList.add("pressed");
	
		if(active != NONE && incrementType == 2){
			var clicksCopy = numberOfClicks;
			setTimeout(function(){
				if(clicksCopy == numberOfClicks){
					countDown(A);
				}
			}, inc*1000);
		} else{
			countDown(A);
		}
	}
}

function restart(){
	active = NONE;
	pause = true;
	setTimeout(function(){
		document.getElementById("pressB").classList.remove("lose");
		document.getElementById("pressA").classList.remove("lose");
		document.getElementById("pressA").classList.remove("pressed");
		document.getElementById("pressB").classList.remove("pressed");
		var newDisplay = formatTime(initTimes[A][0]*HR + initTimes[A][1]*MIN + initTimes[A][2]*SEC);
		times[A] = initTimes[A][0]*HR + initTimes[A][1]*MIN + initTimes[A][2]*SEC;
		previousTimes[A] = times[A];
		if(newDisplay[0] == "00"){
			document.getElementById("timeA").innerHTML = newDisplay[1]+":"+newDisplay[2];
		} else {
			document.getElementById("timeA").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
		}
		document.getElementById("milliA").innerHTML = newDisplay[3];
		
		newDisplay = formatTime(initTimes[B][0]*HR + initTimes[B][1]*MIN + initTimes[B][2]*SEC);
		times[B] = initTimes[B][0]*HR + initTimes[B][1]*MIN + initTimes[B][2]*SEC;
		previousTimes[B] = times[B]
		if(newDisplay[0] == "00"){
			document.getElementById("timeB").innerHTML = newDisplay[1]+":"+newDisplay[2];
		} else {
			document.getElementById("timeB").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
		}
		document.getElementById("milliB").innerHTML = newDisplay[3];
		document.getElementById("pauseIcon").classList.remove("fa-pause");
		document.getElementById("pauseIcon").classList.add("fa-play");
		numberOfClicks = 0;
	}, 11);
}

function pauseGame(){
	if(active == END){
		restart();
	} else if(!pause && (active == A || active == B)){
		pause = true;
		document.getElementById("pauseIcon").classList.remove("fa-pause");
		document.getElementById("pauseIcon").classList.add("fa-play");
	} else if(pause && active==NONE){
		// Do nothing
	} else {
		pause = false;
		document.getElementById("pauseIcon").classList.add("fa-pause");
		document.getElementById("pauseIcon").classList.remove("fa-play");
		if(active == A){
			countDown(A);
		} else if(active==B){
			countDown(B);
		}
	}
}

// Special thanks to the user "Tower" on stackoverflow for the following function.
function requestFullScreen(element) {
	// Supports most browsers and their versions.
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}

function full(){
	var elem = document.body;
	requestFullScreen(elem);
}

delete Hammer.defaults.cssProps.userSelect;

var hammer1 = new Hammer(document.getElementById("pressA"));
var hammer2 = new Hammer(document.getElementById("pressB"));

hammer1.get('rotate').set({ enable: true });
hammer2.get('rotate').set({ enable: true });

hammer1.get('press').set({ time: 1 });
hammer2.get('press').set({ time: 1 });

hammer1.on('tap', function(ev) {
	switchClock(A);
});

hammer1.on('press', function(ev) {
	switchClock(A);
});

hammer1.on('rotate', function(ev) {
	switchClock(A);
});

hammer1.on('swipe', function(ev){
	switchClock(A);
});


hammer2.on('tap', function(ev) {
	switchClock(B);
});

hammer2.on('press', function(ev) {
	switchClock(B);
});

hammer2.on('rotate', function(ev) {
	switchClock(B);
});
hammer2.on('swipe', function(ev){
	switchClock(B);
});



document.body.addEventListener("keypress", keySwitch);

function keySwitch(){
	if(active == A){
		switchClock(A);
	} else if(active == B){
		switchClock(B);
	}
}

restart();