/* 
	jquery objectfit 201403*pike
	
	a cover should size up min
	100% height and width of its
	parent called .objectfit-wrap
	
	a contain should size up max
	100% height and width of its
	parent called .objectfit-wrap
	
	this is similar to css background-size:cover,
	for background, or css object-fit:cover
	
	if one of the above better suits your
	purposes, use that, not this.
	
	to fit an element, just call
		$(elm).cover() or
		$(elm).contain()
	
	for better performance, write the wrapper 
	that should contain the element yourself
	in html and specify the sizes on the 
	element that should be fit.
	
	eg
	
	<div class="objectfit-wrap">
		<video style="width:100px; height:100px"></video>
	...
	$('video').cover();
	
	options	= {	
		fixed 	: bool .. will write px instead of %
		loaded	: bool .. dont recurse if youre not loaded yet
		fit		: cover|contain
	}
	
*/



$.fn.cover = function(options) {
	options = $.extend(options,$.fn.objectfit.defaults);
	options.fit = 'cover';
	$(this).objectfit(options);
}
$.fn.contain = function(options) {
	options = $.extend(options,$.fn.objectfit.defaults);
	options.fit = 'contain';
	$(this).objectfit(options);
}

$.fn.objectfit = function(options) {

	options = $.extend(options,this.defaults);
	
	return this.each(function(idx) {
	
		
    	var $object = $(this);
    	
    	// if its an image, and it hasnt 
    	// loaded yet, return when it has
    	if ($object.is('img') && !($object.attr('height') && $object.attr('width')) 
    		&& !this.complete && !options.loaded) {
    	
    		//alert('$.object : waiting for img '+idx+' to load ..');
    		
    		if ($.fn.objectfit.debug) {
    			console.log('$.objectfit : waiting for img '+idx+' to load ..');
    		}
    		$(this).load(function() {
    			options.loaded=true;
    			$(this).objectfit(options);
    		});
    		
    		// http://nnucomputerwhiz.com/ie9-image-load-event-bug.html
    		this.src=this.src;
    		
    	} else {
    	
    		var objecth = $object.data('objecth'), objectw= $object.data('objectw');
			if (!objecth) { 
				objecth = $object.attr('height');
				if (!objecth && $object.is(':visible')) objecth = $object.height(); 
				if (objecth) $object.data('objecth',objecth); 
			}
			if (!objectw) { 
				objectw = $object.attr('width');
				if (!objectw && $object.is(':visible')) objectw = $object.width(); 
				if (objectw) $object.data('objectw',objectw); 
			}
					
			if (objectw && objecth) {
			
				// create a wrapper if it doesnt exist yet
				var $wrapper = $object.parents('.cover-wrap,.contain-wrap,.objectfit-wrap').eq(0);
				if (!$wrapper.size()) {
				
					if ($.fn.objectfit.debug) {
						console.log('$.objectfit : wrapping object '+idx+'.. ');
					}
					$wrapper = $('<div class="objectfit-wrap"/>').css({
						'width'		: '100%',
						'height'	: '100%',
						'position'	: 'relative',
						'overflow'	: 'hidden'
					})
					$object.wrap($wrapper);
					if ($.fn.objectfit.debug) {
						console.log('$.objectfit : delaying 1 frame after wrap '+idx);
					}
					requestAnimFrame(function(t) {
						$object.objectfit(options);
					});
					
				} else {
				
					if ($.fn.objectfit.debug) {
						console.log('$.objectfit item :'+idx);
					}
					
					// should prehaps check here if the wrapper
					// indeed has overflow:hidden and position:!static
					
					var wrapperh = $wrapper.height(), wrapperw= $wrapper.width();
					
					var wratio = wrapperw/wrapperh, oratio = objectw/objecth;
					
					if ($.fn.objectfit.debug) console.log([objectw,objecth,wrapperw,wrapperh]);
					if ($.fn.objectfit.debug) console.log([oratio,wratio]);
					
					switch (options.fit) {
						case 'cover':
						
							if (wratio>oratio) {
								
								if ($.fn.objectfit.debug)  {
									console.log('$.objectfit : match w, cover h');
								}
								var scale 	= wrapperw/objectw;
								var height 	= objecth*scale;
								var width	= (options.fixed)?wrapperw+'px':'100%';
								var top 	= -(height-wrapperh)/2;
						
								$object.css({
									'position':'absolute',
									'width':width,'height':height+'px',
									'left':0,'top':top+'px'
								});
							
							} else {
							
								if ($.fn.objectfit.debug) {
									console.log('$.objectfit : match h, cover w');
								}
								var scale 	= wrapperh/objecth;
								var width 	= objectw*scale;
								var height	= (options.fixed)?wrapperh+'px':'100%';
								var left 	= -(width-wrapperw)/2;
								
								$object.css({
									'position':'absolute',
									'height':height,'width':width+'px',
									'top':0,'left':left+'px'
								});
							}
							break;
							
						case 'contain':
						
							if (wratio>oratio) {
								
								if ($.fn.objectfit.debug) {
									console.log('$.objectfit : match h, contain w');
								}
								var scale 	= wrapperh/objecth;
								var width 	= objectw*scale;
								var height	= (options.fixed)?wrapperh+'px':'100%';
								var left 	= -(width-wrapperw)/2;
								
								$object.css({
									'position':'absolute',
									'height':height,'width':width+'px',
									'top':0,'left':left+'px'
								});
								
							
							} else {
							
								
								if ($.fn.objectfit.debug)  {
									console.log('$.objectfit : match w, contain h');
								}
								var scale 	= wrapperw/objectw;
								var height 	= objecth*scale;
								var width	= (options.fixed)?wrapperw+'px':'100%';
								var top 	= -(height-wrapperh)/2;
						
								$object.css({
									'position':'absolute',
									'width':width,'height':height+'px',
									'left':0,'top':top+'px'
								});
								
							}
							break;
							
						default :
							if ($.fn.objectfit.debug) console.log(console.log('$.objectfit : unsupported fit '+options.fit));
					
					
					} 
				}
			} else {
				if ($.fn.objectfit.debug && window.console) {
					console.info('$.objectfit : cant fit '+idx+', w or h unknown');
				}
			}
		}
	});
};

$.fn.objectfit.debug = false;

$.fn.objectfit.defaults = {
	fixed	: false,
	loaded	: false,
	fit		: 'cover' // contain
};
