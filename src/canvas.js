'use strict'

var $ = require('jquery');
var Draggable = require('draggable');

// function to show images
function loadImages() {
	// create new XMLHttpRequest object for AJAX
	var xhr = new XMLHttpRequest();

	// set AJAX method & URL
	xhr.open('get', '/images', true);

	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			// get AJAX json response text and parse into array
            var obj = JSON.parse(xhr.responseText);

            // get ul element with id listImages
            var ul = document.getElementById('listImages');
            for(var i = 0; i < obj.length; i++) {
            	// create new li
            	var li = document.createElement('li');

            	// insert img with src and class
            	li.innerHTML = "<img src=\"" + obj[i] + "\" class=\"img-rounded block-add draggable\" draggable=\"true\" />";

            	// append as ul children
            	ul.appendChild(li);
            }
        }
        else {
        }
	}
	xhr.send(null);
	return false;
}

$(document).ready(function() {
	var canvas_width = $(".block").width(), 
		canvas_height = $(".block").height();
	var min_x = 0, max_x, min_y = 0, max_y;

	loadImages();

	$(".draggable-element").each(function() {
		max_x = canvas_width - $(this).width();
		max_y = canvas_height - $(this).height();
		var options = {
			limit: { x: [min_x, max_x], y: [min_y, max_y] }
		};
		new Draggable(this, options);
	});

	$(".draggable-element").on('mousedown', function() {
		$(this).addClass("item selected");
	});

	$(".draggable-element").on('mouseup', function() {
		$(this).removeClass("item selected");
	});
});