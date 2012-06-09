/*
 * Label Slide
 * http://wesleytodd.com/
 *
 * Version 1.2
 *
 * Requires     jQuery
 * Reccomended  Modernizr
 * 
 * Basic Usage:
 * $('form').leSlide({
 *      'wrapperClass'         : 'leSlide-wrap',//This class will be assigned to the wrapper for the input and label
 *      'focusClass'           : 'field-focus', //This class is applied to the wrapper when focus is received
 *      'animate'              : true,          //Use jQuery animation
 *      'animateEasing'        : 'swing',       //jQuery animate() easing
 *      'animateDuration'      : 500,           //jQuery animate() duration
 *      'animateComplete'      : function(){},  //jQuery animate() callback function
 *      'widthOffset'          : 35,            //Add some extra pixels after the text length for better spacing
 *      'textIndendMultiplier' : 2.66           //This multiplier changes the speed the label animates off the screen
 * });
 */
(function($){
	$.leSlide = function(el, options){
		var base = this;
		base.$el = $(el);
		base.el = el;
		base.$el.data("leSlide", base);
		
		base.init = function(){
			base.options = $.extend({}, $.leSlide.defaultOptions, options);
			
			base.$label = $('label[for='+base.$el.attr('id')+']');
			base.placeholder = base.$el.attr('placeholder');
			if(base.placeholder == undefined){
				if(base.$label.length > 1){
					base.$label.each(function(i, e){
						if($(this).is(base.$el.siblings())){
							base.$label = $(this);
							return false;
						}
					});
				}else if(base.$label.length == 0){
					if(base.placeholder != undefined){
						base.$label = $('<label for="'+base.$el.attr('id')+'">'+base.placeholder+'</label>');
					}else{
						base.$label = $('<label for="'+base.$el.attr('id')+'">'+base.toCamel(base.$el.attr('name'))+'</label>');
					}
				}
			} else {
				base.$label = $('<label for="'+base.$el.attr('id')+'">'+base.placeholder+'</label>');
				base.$el.removeAttr('placeholder');
			}
			base.$el
				.wrap('<div class="'+base.options.wrapperClass+'" />')
				.parent('.'+base.options.wrapperClass)
				.prepend(base.$label)
			;
			if(base.options.animate){
				base.$label.css({
					'-moz-transition'    : 'none',
					'-webkit-transition' : 'none',
					'-o-transition'      : 'none',
					'-ms-transition'     : 'none',
					'transition'         : 'none'
				});
			}
			
			var tempLabel = base.$label.clone().css({
				'display' : 'inline',
				'width'   : 'auto'
			});
			base.$label.after(tempLabel);
			base.labelInlineWidth = tempLabel.width();
			tempLabel.remove();
			
			base.inputWidth = base.$el.width();
			base.baseTextIndent = base.inputWidth - base.labelInlineWidth;
			
			base.attachEventHandler(base.el);
			base.eventHandler($.Event());
		};
		
		base.attachEventHandler = function(el){
			$(el).on('focus blur keyup', function(e){
				base.eventHandler(e);
			});
			//Compatibility with the masked password plugin
			$(el).on('unmaskreplace', function(e, newel){
				base.el = newel.get(0);
				base.$el = $(newel);
				base.$el.data("leSlide", base);
				base.attachEventHandler(newel);
			});
		}
		
		base.eventHandler = function(e){
			var ti = 0;
			
			if(e.type == 'focus'){
				if(base.$el.val() == ''){
					ti = base.baseTextIndent;
				}else{
					ti = base.$label.css('text-indent');
				}
				base.$el.parent('.'+base.options.wrapperClass).addClass(base.options.focusClass);
			}else if(e.type == 'blur'){
				if(base.$el.val() == ''){
					//do nothing
				}else{
					ti = base.$label.css('text-indent');
				}
				base.$el.parent('.'+base.options.wrapperClass).removeClass(base.options.focusClass);
			}else{
				if(base.$el.val() != ''){
					//this is where we calculate the more complex text indent
					var shadow = $('<span />').html(base.$el.val());
					base.$el.after(shadow);
					var sw = shadow.width();
					shadow.remove();
					if (sw > base.inputWidth - base.labelInlineWidth - base.options.widthOffset){
						ti = base.baseTextIndent + (sw / base.options.textIndendMultiplier);
					}else{
						ti = base.baseTextIndent;
					}
				}
			}
			
			if(!base.options.animate){
				base.$label.css('text-indent', ti);
			}else{
				base.$label.stop().animate({
					'text-indent' : ti
				}, base.options.animateDuration, base.options.animateEasing, base.options.animateComplete);
			}
		}
		
		base.toCamel = function(str){
			return str.replace(/^([a-z])/, function($1){return $1.toUpperCase();});
		};
		
		base.init();
	};
	$.leSlide.defaultOptions = {
		'wrapperClass'         : 'leSlide-wrap',//This class will be assigned to the wraper for the input and label
		'focusClass'           : 'field-focus', //This class is applied to the wraper when focus is recieved
		'animate'              : true,          //Use jQuery animation
		'animateEasing'        : 'swing',       //jQuery animate() easing
		'animateDuration'      : 500,           //jQuery animate() duration
		'animateComplete'      : function(){},  //jQuery animate() callback function
		'widthOffset'          : 35,            //Add some extra pixels after the text length for better spacing
		'textIndendMultiplier' : 2.66           //This multiplier changes the speed the label animates off the screen
	};
	$.fn.leSlide = function(options){
		return this.each(function() {
			if($(this).is('input[type=text], input[type=password]')){
				(new $.leSlide(this, options));
			}else{
				$(this).find('input[type=text], input[type=password]').each(function(i, e){
					(new $.leSlide(e, options));
				});
			}
		});
	};
})(jQuery);