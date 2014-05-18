// memory-matching.js
// Aim for clarity, not for cleverness.

// Declare a variable named `matchingGame`.
var matchingGame = {

	// `elapsedTime` is a property of matchingGame. It is a number.
	elapsedTime: 0
};

// `deck` is a property of matchingGame. It is an Array.
matchingGame.deck = [];

// `shuffle` is a Function.
// It returns a number.
// It takes 0.5 and subtracts it from a random number between 0 and 1.
function shuffle() {
	return 0.5 - Math.random();
}

// `selectCard` is a Function.
// The function SelectCard is also a "conditional."

function selectCard() {

	// Let's just pretend.

	// The days before jQuery ever existed, dark, dark days...

	document.getElementByClass("card-flipped")


	// API for an if-statement is this:
	// if (someConditionIsTrue)
	// It's gonna evaluate what is within the ().

	var condition = $(".card-flipped").size() > 1;


	if (condition) {

		// Q: What is return?
		// Alyson's A: Return is creating the next action as defined in this condition.
		// Truth: When you return, you leave.
		// In geek language, we call an immediate `return` a no-op.
		return;
	}

	// Q: What does $(this) do?
	// Truth: Will give you the jQuery wrapped verision of window

	// Q: What does `this` do?
	// Truth: The window object
	// Window is the top object in the console

	console.log(this)

	$(this).addClass("card-flipped");
	if ($(".card-flipped").size() == 2) {
		setTimeout(checkPattern,1400);
	}
}

function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd",removeTookCards);
	} else {
		$(".card-flipped").removeClass("card-flipped");
	}
}

function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

function removeTookCards() {
	$(".card-removed").remove();
	if ($(".card").length == 0) {
		gameover();
	}
}

function gameover() {
	clearInterval(matchingGame.timer);
	$(".score").html($("#elapsed-time").html());

	var lastScore = localStorage.getItem("last-score");
	lastScoreObj = JSON.parse(lastScore);
	if (lastScoreObj == null) {
		lastScoreObj = {"savedTime": "no record", "score": 0};
	}
	var lastElapsedTime = lastScoreObj.score;
	var minute = Math.floor(lastElapsedTime / 60);
	var second = lastElapsedTime % 60;
	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	$(".last-score").html(minute+":"+second);
	var savedTime = lastScoreObj.savedTime;
	$(".saved-time").html(savedTime);

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	var seconds = currentTime.getSeconds();
	if (seconds < 10) seconds = "0" + seconds;
	var now = day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
	var obj = {
		"savedTime": now,
		"score": matchingGame.elapsedTime
	};
	localStorage.setItem("last-score", JSON.stringify(obj));

	if (lastElapsedTime == 0 || matchingGame.elapsedTime < lastElapsedTime) {
		$(".ribbon").removeClass("hide");
	}

	$("#popup").removeClass("hide");
}

function countTimer() {
	matchingGame.elapsedTime++;
	var minute = Math.floor(matchingGame.elapsedTime / 60);
	var second = matchingGame.elapsedTime % 60;

	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	$("#elapsed-time").html(minute+":"+second);
}

// This all JQuery, I know this b/c of the $

	$(function(){


	var Hubbers = {};
	Hubbers.hubbers = [];
	var x = 0;

	// get all drake albums
	$.getJSON( "https://partner.api.beatsmusic.com/v1/api/artists/ar241215/albums?client_id=fj3ca8j47q4tt626qw8ytcas", function( response ) {
		$.each(response.data, function (key,album) {
			// get all drake album art
			album_image = 'https://partner.api.beatsmusic.com/v1/api/albums/'+album.id+'/images/default?client_id=frmxsyg64w6z9qq8e5rb7b69';
			Hubbers.hubbers[x] = {};
			Hubbers.hubbers[x].gravatar = album_image;
			x++;

			console.log(Hubbers);
		});

		// Like this https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

		Hubbers["hubbers"].sort(shuffle).slice(0,8).map(function(hubber){
			matchingGame.deck.push(hubber)
			matchingGame.deck.push(hubber)
		});

		console.log(matchingGame.deck)

		matchingGame.deck.sort(shuffle);

		for(var i=0;i<15;i++){
			$('.card:first-child').clone().appendTo('#cards');
		}

		$('#cards').children().each(function(index) {
			$(this).css({
				'left': ($(this).width() + 15) * (index % 4),
				'top': ($(this).height() + 15) * Math.floor(index / 4)
			});

			var Hubber = matchingGame.deck.pop();
			// This is some shit - we are going to dynamically apply css to the card(s).
			$(this)
			.css("background", "#efefef url(" + Hubber.gravatar + ")")
			.css("background-size", "128px 128px")
			$(this).attr("data-pattern",Hubber.login);

			if ($("[data-pattern="+Hubber.login+"] .name").text() == "") {
				$(this).find(".name").text(Hubber.name);
			} else {
				$(this).find(".login").text(Hubber.login);
			}

			$(this).click(selectCard);
		});
		matchingGame.timer = setInterval(countTimer, 1000);
	});
});
