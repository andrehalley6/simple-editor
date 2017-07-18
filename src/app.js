'use strict'

var jQuery = require('jquery');
var $ = jQuery;

// function to upload an image
var submit = document.getElementById("submit");

submit.addEventListener("click", function(e){
    // get input value
    var formData = new FormData();
    var file = document.getElementById("upload").files[0];
    formData.append("upload", file);

    // create new XMLHttpRequest object for AJAX
    var xhr = new XMLHttpRequest();

    // set AJAX method & URL
    xhr.open("post", "/uploads", true);

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);
			
			// append new uploaded image into listImages
			var ul = document.getElementById("listImages");
			var li = document.createElement("li");
			li.innerHTML = "<img src=\"" + response.file + "\" class=\"img-rounded block-add draggable\" draggable=\"true\" />";
			ul.appendChild(li);
            // return true;
        }
        else {
        	console.log(xhr.responseText);
        	// return false;
        }
    }
    
	xhr.send(formData);
}, false);

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

$(document).ready(function(e) {
	var selected = null, // Object of the element to be moved
	    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
	    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
	var canvas_width = $(".block").width(), 
		canvas_height = $(".block").height();

	// Get all images in folder
	$.get('/images', function(data) {
		data.forEach(function(object, index, arr) {
			var $img = $("<li><img src=\"" + object + "\" class=\"img-rounded block-add draggable\" draggable=\"true\" /></li>");
			$("#listImages").append($img);
		});
	});

	// Upload images
	$("#submit").on('click', function() {
		$.post('/uploads', function(data) {
			var $img = $("<li><img src=\"" + data.file + "\" class=\"img-rounded block-add draggable\" draggable=\"true\" /></li>");
			$("#listImages").append($img);
		});
	});

	// Will be called when user starts dragging an element
	function _drag_init(elem) {
	    // Store the object of the element which needs to be moved
	    selected = elem;
	    x_elem = x_pos - selected.offsetLeft;
	    y_elem = y_pos - selected.offsetTop;

	    $(elem).addClass('item selected');
	}

	// Will be called when user dragging an element
	function _move_elem(e) {
		x_pos = document.all ? window.event.clientX : e.pageX;
		y_pos = document.all ? window.event.clientY : e.pageY;
		if (selected !== null) {
			selected.style.left = (x_pos - x_elem) + 'px';
			selected.style.top = (y_pos - y_elem) + 'px';

			var space_x = selected.offsetWidth / 2, 
				space_y = selected.offsetHeight / 2;

			if(selected.offsetLeft < space_x) {
				selected.style.left = space_x + 'px';
			}

			if(selected.offsetTop < space_y) {
				selected.style.top = space_y + 'px';
			}

			if(selected.offsetLeft + selected.offsetWidth - space_x > canvas_width) {
				selected.style.left = (canvas_width - selected.offsetWidth + space_x) + 'px';
			}

			if(selected.offsetTop + selected.offsetHeight - space_y > canvas_height) {
				selected.style.top = (canvas_height - selected.offsetHeight + space_y) + 'px';
			}
		}
	}

	// Destroy the object when we are done
	function _destroy() {
		$(selected).removeClass('item selected');
		selected = null;
	}

	// Bind the functions...
	// document.getElementById('draggable-element').onmousedown = function () {
	// document.getElementsByClassName('draggable-element').onmousedown = function () {
	// 	console.log(this);
	// 	_drag_init(this);
	// 	return false;
	// };

	$(document).on('click', '.img-rounded', function(e) {
		var src = $(this).attr('src');
		var img = $("<div><img src=\"" + src + "\" class=\"item draggable-element inserted-element\" /></div>");
		$(".block").append(img);
	});

	$("#addText").on('click', function(e) {
		var text = $("<div><p class=\"item text-element draggable-element inserted-element\">Add your text!</p></div>");
		$(".block").append(text);
	});

	$(document).on('dblclick', 'p.text-element', function(e) {
		$(this).css('position', 'absolute').attr('contenteditable', true).removeClass('draggable-element').focus();
		setTimeout(function() {
			if(document.activeElement !== $(this)) {
				$(this).attr('contenteditable', false);
			}
		}, 300);
	});

	$(document).on('blur', 'p.text-element', function(e) {
		$(this).attr('contenteditable', false);
		$(this).addClass('draggable-element').css('position', '');
	});

	$(document).on('mousedown', '.draggable-element', function(e) {
		_drag_init(this);
		return false;
	});

	// Bind the event listeners for the image elements
	var images = $("img.draggable");
	setTimeout(function() {
		images = $("img.draggable");
		images.each(function(i, el) {
			$(this).on("dragstart", handleDragStart);
			$(this).on("dragend", handleDragEnd);
		})
	}, 500);

	$(document).on("dragenter", ".block", handleDragEnter);
	$(document).on("dragover", ".block", handleDragOver);
	$(document).on("dragleave", ".block", handleDragLeave);
	$(document).on("drop", ".block", handleDrop);

	function handleDragStart(e) {
		[].forEach.call(images, function(img) {
			img.classList.remove('img_dragging', 'active');
		});
		this.classList.add('img_dragging', 'active');
	}

	function handleDragOver(e) {
		if(e.preventDefault) {
			e.preventDefault();
		}

		return false;
	}

	function handleDragEnter(e) {
		this.classList.add('over');
	}

	function handleDragLeave(e) {
		this.classList.remove('over');
	}

	function handleDrop(e) {
		if(e.stopPropagation) {
			e.stopPropagation();
		}

		// add images here
		var x = Math.floor(e.pageX - $(".block").offset().left);
		var y = Math.floor(e.pageY - $(".block").offset().top);
		var elem = $("img.active");
		var added_element = $("<div><img src=\"" + elem.attr('src') + "\" class=\"draggable-element inserted-element\" style=\"left: " + x + "; top: " + y + ";\" /></div>")
		$(".block").append(added_element);
	}

	function handleDragEnd(e) {
		[].forEach.call(images, function(img) {
			img.classList.remove('img_dragging', 'active');
		})
	}

	document.onmousemove = _move_elem;
	document.onmouseup = _destroy;
});