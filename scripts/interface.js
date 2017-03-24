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

var active = NONE;

var numberOfClicks = 0;

// Represents user-set times for players A & B
var initTimes = [[0, 5, 0], [0, 5, 0]]; 
var inc = 0;

var times = [2*SEC,2*SEC];

function formatTime(x){
	var seconds =(x%MIN);
	var minutes = (x%HR)-seconds;
	var hours = Math.floor((x-minutes-seconds)/HR);
	minutes = Math.floor(minutes/MIN);
	seconds = Math.floor(seconds/SEC);
	
	var message = [hours.toString(), minutes.toString(), seconds.toString()];

	for (var i =0; i<3; i++){
		if(message[i].length < 2){
			message[i] = "0" + message[i];
		}
	}
	return message;
}

function selectHour(x, player){
	initTimes[player][0] = x;
	updateDisplays();
}
function selectMinute(x, player){
	initTimes[player][1] = x;
	updateDisplays();
}
function selectSecond(x, player){
	initTimes[player][2] = x;
	updateDisplays();
}

function selectInc(x){
	inc = x;
	updateDisplays();
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
	if(times[x]==0){
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
					times[x] -= 10;
					var newDisplay = formatTime(times[x]);
					if(x==A){
						if(newDisplay[0] == "00"){
							document.getElementById("timeA").innerHTML = newDisplay[1]+":"+newDisplay[2];
						} else {
							document.getElementById("timeA").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
						}
					} else {
						if(newDisplay[0] == "00"){
							document.getElementById("timeB").innerHTML = newDisplay[1]+":"+newDisplay[2];
						} else {
							document.getElementById("timeB").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
						}
					}
					countDown(x);
				}
			},10);
		}
	}
}

function switchClock(x){
	if ((!pause && (active != B && active != END && x==A)) || (pause && active == NONE && x==A)){
		numberOfClicks += 1;
		if(active != NONE){
			times[A] += inc*1000
		}
		active = B;
		
		switchSound1();
		if(pause) { pause = false; }
		document.getElementById("pauseIcon").classList.add("fa-pause");
		document.getElementById("pauseIcon").classList.remove("fa-play");
		
		document.getElementById("pressB").classList.remove("pressed");
		document.getElementById("pressA").classList.add("pressed");

		countDown(B);
	} else if((!pause && (active != A && active != END && x==B )) || (pause && active == NONE && x==B)){
		numberOfClicks += 1;
		if(active != NONE){
			times[B] += inc*1000
		}
		active = A;
		
		switchSound2();
		if(pause) { pause = false; }
		document.getElementById("pauseIcon").classList.add("fa-pause");
		document.getElementById("pauseIcon").classList.remove("fa-play");
		
		document.getElementById("pressA").classList.remove("pressed");
		document.getElementById("pressB").classList.add("pressed");
	
		countDown(A);
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
		if(newDisplay[0] == "00"){
			document.getElementById("timeA").innerHTML = newDisplay[1]+":"+newDisplay[2];
		} else {
			document.getElementById("timeA").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
		}
		
		newDisplay = formatTime(initTimes[B][0]*HR + initTimes[B][1]*MIN + initTimes[B][2]*SEC);
		times[B] = initTimes[B][0]*HR + initTimes[B][1]*MIN + initTimes[B][2]*SEC;
		if(newDisplay[0] == "00"){
			document.getElementById("timeB").innerHTML = newDisplay[1]+":"+newDisplay[2];
		} else {
			document.getElementById("timeB").innerHTML = newDisplay[0] +":"+newDisplay[1]+":"+newDisplay[2];
		}
		document.getElementById("pauseIcon").classList.remove("fa-pause");
		document.getElementById("pauseIcon").classList.add("fa-play");
	}, 101);
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

hammer1.on('tap', function(ev) {
	switchClock(A);
});

hammer1.on('rotate', function(ev) {
	switchClock(A);
});


hammer2.on('tap', function(ev) {
	switchClock(B);
});

hammer2.on('rotate', function(ev) {
	switchClock(B);
});

restart();