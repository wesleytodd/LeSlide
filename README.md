#Label Slide (leSlide)

Formerly at https://github.com/wesleytodd/Form-FX/tree/master/leslide

**Version 1.3**

A plugin which creates a sliding placeholder effect.  See [demo page](https://rawgithub.com/wesleytodd/LeSlide/master/index.html) for an example.

You can call this on either a set of inputs or an entire form.  If the input has placeholder text it will use that as the sliding text.  If no placeholder is specified, the corresponding label will be used (based on for and id attributes).

## Example
	$('form').leSlide({
	      'wrapperClass'         : 'leSlide-wrap',//This class will be assigned to the wrapper for the input and label
	      'focusClass'           : 'field-focus', //This class is applied to the wrapper when focus is received
	      'animate'              : true,          //Use jQuery animation
	      'animateEasing'        : 'swing',       //jQuery animate() easing
	      'animateDuration'      : 500,           //jQuery animate() duration
	      'animateComplete'      : function(){},  //jQuery animate() callback function
	      'widthOffset'          : 35,            //Add some extra pixels after the text length for better spacing
	      'textIndendMultiplier' : 2.66           //This multiplier changes the speed the label animates off the screen
	});

## CSS

**Required**

	.leSlide-wrap {
	    position: relative;
	}
	.leSlide-wrap label {
	    position: relative;
	    z-index: 1;
	    white-space: pre;
	}
	.leSlide-wrap input {
	    position: absolute;
	    top: 0;
	    left: 0;
	    z-index: 2;
	}

If you are using a custom wrapper class (ie. 'wrapperClass'), change the class to match.

**Optional**

	.leSlide-wrap input {
	    background: none;
	    border: 0;
	}
	.leSlide-wrap label {
	    border: 1px solid #ccc;
	    background: #eee;
	    width: 350px;
	}
	.field-focus label {
	    color: #ccc;
	    border: 1px solid #999;
	    background: #fff;
	}
	.csstransitions .leSlide-wrap label {
	    -webkit-transition: all 0.3s ease-out;
	    -moz-transition: all 0.3s ease-out;
	    -ms-transition: all 0.3s ease-out;
	    -o-transition: all 0.3s ease-out;
	    transition: all 0.3s ease-out;
	}

These styles are just guidelines.  Here are things to remember while implementing:

1.	The input should have no background or border
2.	Use styling on the label to mimic the border and background of the input
3.	You can use the focus class (ie. 'field-focus') to style the label like you would an input with focus
4.	If you are using Modernizr and/or CSS3 you can declare transitions for the label animations.  If using css transitions, disable animations to prevent odd behavior (ie. 'animate' : false)
