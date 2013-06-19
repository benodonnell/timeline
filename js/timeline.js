/* Copyright 2013 Benjamin O'Donnell */
/* This file is part of MovementTimeline.

    MovementTimeline is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MovementTimeline is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MovementTimeline.  If not, see <http://www.gnu.org/licenses/>.*/

timeline = null;
timelineDiv = null;
colorFunction = dimmerColor;
initSat = 0.9; //This must be a number between 0 and 1.
minSat = 0.45; //This must be a number between 0 and 1. It should be less than initSat in order to have any effect.
initVal = 0.85; //This must be a number between 0 and 1.
minVal = 0.75; //This must be a number between 0 and 1. It should be less than initVal in order to have any effect.

function drawLine(year, event, horizontalPadding, initColor) {
	var yearPos = year.offset();
	var eventPos = event.offset();
	
	var horiz = eventPos.left - yearPos.left - year.width() - (2 * horizontalPadding);
	var vert = eventPos.top + (event.height()/2) - yearPos.top - (year.height()/2);
	
	//a quick fix for when the event text is smaller than the year number text. We enforce a horizontal line.
	if (vert < 0){
		vert = 0;
	}
	
	var length = Math.sqrt(Math.pow(horiz, 2) + Math.pow(vert, 2));
	var angle = (-180 / 3.14159) * Math.asin(horiz/length);

	var line = $('<div>', {
		class: "line"
	});
	
	line.css("height", length)
	.css("position", "absolute")
	.css("top", yearPos.top + (year.height()/2))
	.css("left", yearPos.left + year.width() + horizontalPadding)
	.css('-webkit-transform', 'rotate(' + angle + 'deg)')
    .css('-moz-transform', 'rotate(' + angle + 'deg)')
    .css('-o-transform', 'rotate(' + angle + 'deg)')
    .css('-ms-transform', 'rotate(' + angle + 'deg)')
    .css('transform', 'rotate(' + angle + 'deg)');
    
   	var color = colorFunction(initColor);
   	line.css("background-color", "rgb(" + color.red + "," + color.green + ","+ color.blue + ")");

	timelineDiv.append(line);
}

function HSVColor() {
	this.hue = 0;
	this.saturation = 0;
	this.value = 0;
	for (var n in arguments[0]) {
		this[n] = arguments[0][n];
	}
}

HSVColor.prototype.randomBrightColor = function() {
	this.hue = Math.random() * 360;
	this.saturation = 1 - (Math.random() * 0.8);
	this.value = 1 - (Math.random() * 0.1);
}

HSVColor.prototype.randomSaturatedColor = function() {
	this.hue = Math.random() * 360;
	this.saturation = 1;
	this.value = 1
}

HSVColor.prototype.randomHue = function(saturation, value) {
	this.hue = Math.random() * 360;
	this.saturation = saturation;
	this.value = value;
}
	
HSVColor.prototype.toRGB = function() {
	var chroma = this.saturation * this.value;
	var hprime = this.hue / 60;

	var X = chroma * (1 - Math.abs(hprime % 2 - 1));

	var r = 0;
	var g = 0;
	var b = 0;

	//First check if it's black, since the subsequent math doesn't make sense for black.
	if (this.saturation == 0 && this.value == 0)
	{
		return (
			{red: 0,
			green: 0,
			blue: 0}
		);
	}

	if (0 <= hprime && hprime < 1){
		r = chroma;
		g = X;
	} else if (1 <= hprime && hprime < 2) {
		r = X;
		g = chroma;
	} else if (2 <= hprime && hprime < 3) {
		g = chroma;
		b = X;
	} else if (3 <= hprime && hprime < 4) {
		g = X;
		b = chroma;
	} else if (4 <= hprime && hprime < 5) {
		r = X;
		b = chroma;
	} else if (5 <= hprime && hprime < 6) {
		r = chroma;
		b = X;
	}
	
	var m = this.value - chroma;
	
	r += m;
	g += m;
	b += m;
	
	return (
		{red: Math.floor(r * 256),
		green: Math.floor(g * 256),
		blue: Math.floor(b * 256)}
	);
}

function blackColor(){
	return ({red: 0, green: 0, blue: 0});
}

function brightColor(){
	var hsv = new HSVColor();
	hsv.randomBrightColor();
	return (hsv.toRGB());
}

function dimmerColor(color) {
	color.saturation -= .05;
//	color.value -= .005;

	if (color.saturation < minSat)
	{
		color.saturation = minSat;
	}
	if (color.value < minVal)
	{
		color.value = minVal;
	}

	if (color.saturation < 0)
	{
		color.saturation = 0;
	}
	if (color.value < 0)
	{
		color.value = 0;
	}

	return (color.toRGB());
}

function generateTimeline(csv) {
	timeline = $.csv.toObjects(csv);

	var currentYear = null;
	var currentYearNum = null;
	var currentColor = null;

	//Print some test data
	for (i=0;i<timeline.length;i++){
		//Check that there is *some* data in this row. Otherwise skip to the next row.
		if (timeline[i]["Year"] != "" || timeline[i]["Milestone/Organization"] !="" || timeline[i]["People"] != "" || timeline[i]["URL"] != "" || timeline[i]["Comments"] != "" || timeline[i]["Month"] != "") {	
			//check if we need a new year:
			if (timeline[i]["Year"] != "" && timeline[i]["Year"] != currentYearNum)
			{
				//unless we're on the first div, we through a <br /> in for good measure. Otherwise years with no data won't display correctly.
				if (currentYear != null){
					timelineDiv.append("<br />");
				}
				currentYearNum = timeline[i]["Year"];
				currentColor = new HSVColor();
				currentColor.randomHue(initSat, initVal);
				var colors = colorFunction(currentColor);
				currentYear = $("<div>", {class: "year"});
				currentYear.append($("<div>", {class: "yearNum"}).text(timeline[i]["Year"]).css("color", "rgb(" + colors.red + "," + colors.green + "," + colors.blue + ")"));
				timelineDiv.append(currentYear);
			}
			
			//create the event div:
			var event = $("<div>", {class: "event"});
			if (timeline[i]["Month"] != null && timeline[i]["Month"] != "") {
				event.append($("<div>", {class: "month"}).text(timeline[i]["Month"]));
			}
			if (timeline[i]["Comments"] != "") {
				event.append($("<span>", {class: "comment"}).text(timeline[i]["Comments"]));
				event.mouseenter(showComment).mouseleave(hideComment);
			}
			if (timeline[i]["Milestone/Organization"] != ""){
				var title = $("<div>", {class: "eventTitle"});
				if (timeline[i].URL != ""){
					title.append($("<a>", {href: timeline[i].URL}).text(timeline[i]["Milestone/Organization"]));
				}
				else {
					title.text(timeline[i]["Milestone/Organization"]);
				}
				event.append(title);
			}
			if (timeline[i]["People"] != ""){
				event.append($("<div>", {class: "people"}).text(timeline[i]["People"]));
			}
			
			//add the event div to the year div.
			currentYear.append(event);
			drawLine(currentYear.find(".yearNum"), event.find("div:first"), 10, currentColor);
		}
	}
}

function loadTimeline() {
	timelineDiv = $("#timeline");
	$.get("./TimelineData.csv", {}, generateTimeline, "text");
}

function showComment() {
	$(this).find(".comment").fadeIn();
}

function hideComment() {
	$(this).find(".comment").css("display", "none");
}

$(loadTimeline);