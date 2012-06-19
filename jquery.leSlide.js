/*
 * Label Slide
 * http://wesleytodd.com/
 *
 * Version 1.3
 *
 * Requires     jQuery
 * 
 * Basic Usage:
 * $('form').leSlide({
 *      'wrapper'              : false,         //A function that returns the wraper as a jQuery object
 *      'wrapperClass'         : 'leSlide-wrap',//This class will be assigned to the wraper for the input and label
 *      'label'                : false,         //A function that returns the label as a jQuery object
 *      'focusClass'           : 'field-focus', //This class is applied to the wraper when focus is recieved
 *      'animate'              : true,          //Use jQuery animation
 *      'animateEasing'        : 'swing',       //jQuery animate() easing
 *      'animateDuration'      : 500,           //jQuery animate() duration
 *      'animateComplete'      : function(){},  //jQuery animate() callback function
 *      'widthOffset'          : 35,            //Add some extra pixels after the text length for better spacing
 *      'textIndentMultiplier' : 2.66,          //This multiplier changes the speed the label animates off the screen
 *      'textIndentOffset'     : 10             //Adds extra spacing on the right of label
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
			
			if(typeof base.options.wrapper == 'function'){
				base.$wrapper = base.options.wrapper.call(this, base.$el).addClass(base.options.wrapperClass);
			} else {
				base.$wrapper = base.$el.wrap('<div class="'+base.options.wrapperClass+'" />').closest('.'+base.options.wrapperClass);
			}
			
			if(typeof base.options.label == 'function'){
				base.$label = base.options.label.call(this, base.$el).attr('for', base.$el.attr('id'));
			} else {
				base.$label = $('<label>'+base.$el.attr('placeholder')+'</label>').attr('for', base.$el.attr('id'));
			}
			base.$el.removeAttr('placeholder');
			base.$wrapper.prepend(base.$label);
			
			if(base.options.animate){
				base.$label.css({
					'-moz-transition'    : 'none',
					'-webkit-transition' : 'none',
					'-o-transition'      : 'none',
					'-ms-transition'     : 'none',
					'transition'         : 'none'
				});
			}
			base.updateWidths();
			base.attachEventHandler(base.el);
			base.eventHandler($.Event());
		};
		
		base.updateWidths = function(){
			console.log('here');
			var tempLabel = base.$label.clone().css({
				'display' : 'inline',
				'width'   : 'auto'
			});
			base.$label.after(tempLabel);
			base.labelInlineWidth = tempLabel.width();
			tempLabel.remove();
			
			base.inputWidth = base.$el.width();
			base.baseTextIndent = base.inputWidth - base.labelInlineWidth - base.options.textIndentOffset;
		}
		
		base.attachEventHandler = function(el){
			$(el).on('focus blur keyup', function(e){
				base.eventHandler(e);
			});
			$(window).on('resize', function(){
				clearTimeout(base.resizeTimer);
				base.resizeTimer = setTimeout(function(){
					base.updateWidths();
				}, 20)
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
					ti = ti - base.options.textIndentOffset;
				}
				base.$el.closest('.'+base.options.wrapperClass).addClass(base.options.focusClass);
			}else if(e.type == 'blur'){
				if(base.$el.val() != ''){
					ti = base.$label.css('text-indent');
					ti = ti  - base.options.textIndentOffset;
				}
				base.$el.closest('.'+base.options.wrapperClass).removeClass(base.options.focusClass);
			}else{
				if(base.$el.val() != ''){
					//this is where we calculate the more complex text indent
					var shadow = $('<span />').html(base.$el.val());
					base.$el.after(shadow);
					var sw = shadow.width();
					shadow.remove();
					if (sw > base.inputWidth - base.labelInlineWidth - base.options.widthOffset - base.options.textIndentOffset){
						ti = base.baseTextIndent + (sw / base.options.textIndentMultiplier);
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
		
		base.init();
	};
	$.leSlide.defaultOptions = {
		'wrapper'              : false,
		'wrapperClass'         : 'leSlide-wrap',//This class will be assigned to the wraper for the input and label
		'label'                : false,
		'focusClass'           : 'field-focus', //This class is applied to the wraper when focus is recieved
		'animate'              : true,          //Use jQuery animation
		'animateEasing'        : 'swing',       //jQuery animate() easing
		'animateDuration'      : 500,           //jQuery animate() duration
		'animateComplete'      : function(){},  //jQuery animate() callback function
		'widthOffset'          : 35,            //Add some extra pixels after the text length for better spacing
		'textIndentMultiplier' : 2.66,          //This multiplier changes the speed the label animates off the screen
		'textIndentOffset'     : 10             //Adds extra spacing on the right of label
	};
	$.fn.leSlide = function(options){
		return this.each(function() {
			(new $.leSlide(this, options));
		});
	};
})(jQuery);