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

var timerWait = 37; // Defines amount of milliseconds waited before checking time again

// Special thanks to an answer by sweets-BlingBling on stackoverflow 
// at http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery for
// the following function:
						
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

if(!isMobile){
	// Faster speed on non-mobile devices, as processing power is better.
	timerWait = 21;
}

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
		times[x] = 0;
		
		// Small trick to hide negative time
		if(x == A){
			document.getElementById("timeA").innerHTML = "00:00";
			document.getElementById("milliA").innerHTML = "000";
		} else {
			document.getElementById("timeB").innerHTML = "00:00";
			document.getElementById("milliB").innerHTML = "000";
		}
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
				// This 'if' statement makes sure that this countdown is cancelled in case the users click twice before timerWait ms has passed.
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
					if(clicksCopy == numberOfClicks){ 
						countDown(x);
					}
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