'use strict'

var jQuery = require('jquery');
var $ = jQuery;

$(document).ready(function(e) {
	var selected = null, // Object of the element to be moved
	    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
	    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
	var canvas_width = $(".block").width(), 
		canvas_height = $(".block").height();
	var object_size = 0.25; // Default size is 25% from canvas size
	var object_width = (object_size * canvas_width) / 2;
	var object_height = (object_size * canvas_height) / 2;

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

	    $(".item").removeClass("selected");
	    $(elem).addClass('selected');
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

			// if(selected.offsetLeft < 0) {
			// 	selected.style.left = '0px';
			// }

			// if(selected.offsetTop < 0) {
			// 	selected.style.top = '0px';
			// }

			// if(selected.offsetLeft + selected.offsetWidth > canvas_width) {
			// 	selected.style.left = (canvas_width - selected.offsetWidth) + 'px';
			// }

			// if(selected.offsetTop + selected.offsetHeight > canvas_height) {
			// 	selected.style.top = (canvas_height - selected.offsetHeight) + 'px';
			// }
		}
	}

	// Destroy the object when we are done
	function _destroy() {
		selected = null;
	}

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
		// canvas width, height = 600px
		// var object_width = (object_size * canvas_width) / 2;
		// var object_height = (object_size * canvas_height) / 2;
		if(x < object_width) {
			x = object_width;
		}

		if(y < object_height) {
			y = object_height;
		}

		if(x + object_width > canvas_width) {
			x = canvas_width - object_width;
		}

		if(y + object_height > canvas_height) {
			y = canvas_height - object_height;
		}
		var elem = $("img.active");
		var added_element = $("<div><img src=\"" + elem.attr('src') + "\" class=\"item draggable-element inserted-element\" style=\"left: " + x + "px; top: " + y + "px;\" /></div>");
		$(".block").append(added_element);
	}

	function handleDragEnd(e) {
		[].forEach.call(images, function(img) {
			img.classList.remove('img_dragging', 'active');
		})
	}

	document.onmousemove = _move_elem;
	document.onmouseup = _destroy;

	// Bind the functions...
	// document.getElementById('draggable-element').onmousedown = function () {
	// document.getElementsByClassName('draggable-element').onmousedown = function () {
	// 	console.log(this);
	// 	_drag_init(this);
	// 	return false;
	// };

	$(window).on('click', function(e) {
		$(".item").removeClass("selected");
	});

	$(document).on('click', '.item', function(e) {
		e.stopPropagation();
	});

	// key event (move left, right, up, down, delete)
	$(document).on('keydown', function(e) {
		var key = e.which;
		var element = $(".item.selected");
		// var position = element.offset();
		// var position = element.position();
		// var x = Math.floor(e.pageX - $(".block").offset().left);
		// var y = Math.floor(e.pageY - $(".block").offset().top);
		// console.log(element.offset().left, element.offset().top, $(".block").offset().left, $(".block").offset().top, position, x, y);
		
		var left = parseInt(element.css('left'));
		var top = parseInt(element.css('top'));
		
		// canvas width, height = 600px
		// var object_width = Math.ceil((object_size * canvas_width) / 2);
		// var object_height = Math.ceil((object_size * canvas_height) / 2);
		switch(key) {
			case 37:
				// left
				left--;
				// if already leftmost, stop move
				if(Math.ceil(left) >= object_width) {
					element.css('left', left + 'px');
				}
				break;
			case 38:
				// up
				top--;
				// if already topmost, stop move
				if(Math.ceil(top) >= object_height) {
					element.css('top', top + 'px');
				}
				break;
			case 39:
				// right
				left++;
				// if already rightmost, stop move
				if(Math.ceil(left) + object_width <= canvas_width) {
					element.css('left', left + 'px');
				}
				break;
			case 40:
				// down
				top++;
				// if already bottommost, stop move
				if(Math.ceil(top) + object_height <= canvas_height) {
					element.css('top', top + 'px');
				}
				break;
			case 46:
				// delete
				element.remove();
				break;
		}
	});

	// add image into canvas by clicking on image
	$(document).on('click', '.img-rounded', function(e) {
		var src = $(this).attr('src');
		var img = $("<div><img src=\"" + src + "\" class=\"item draggable-element inserted-element\" /></div>");
		$(".block").append(img);
	});

	// add text into canvas
	$("#addText").on('click', function(e) {
		var text = $("<div><p class=\"item text-element draggable-element inserted-element\">Add your text!</p></div>");
		$(".block").append(text);
	});

	// canvas text change by double click
	$(document).on('dblclick', 'p.text-element', function(e) {
		$(this).attr('contenteditable', true).removeClass('draggable-element').focus();
		setTimeout(function() {
			if(document.activeElement !== $(this)) {
				$(this).attr('contenteditable', false);
			}
		}, 300);
	});

	// set back text after finish editing
	$(document).on('blur', 'p.text-element', function(e) {
		$(this).attr('contenteditable', false);
		$(this).addClass('draggable-element');
	});
});