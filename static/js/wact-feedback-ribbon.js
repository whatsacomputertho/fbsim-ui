//Template for the inner HTML and CSS of the component
const wactFeedbackRibbonTemplate = document.createElement("template");
wactFeedbackRibbonTemplate.innerHTML = `
  <style>
  	:host
    {
      display: block;
      width: 100%;
    }
    
    .feedback-ribbon__ribbon-progress-wrapper
    {
    	box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.7);
    }
    
    .feedback-ribbon__ribbon-wrapper, .feedback-ribbon__ribbon-wrapper-dark
    {
      display: grid;
      grid-template-columns: 2% 90% 8%;
    }
    
    .feedback-ribbon__ribbon-wrapper
    {
    	background-color: #d3d3d3;
    }
    
    .feedback-ribbon__ribbon-wrapper-dark
    {
    	background-color: #282828;
    }
    
    .feedback-ribbon__color-sidebar, .feedback-ribbon__color-sidebar-dark
    {
    	background-color: #C00000;
    }
    
    .feedback-ribbon__feedback-text-wrapper, .feedback-ribbon__feedback-text-wrapper-dark
    {
    	padding: 2%;
    }
    
    .feedback-ribbon__feedback-text-dark
    {
    	color: #f5f5f5;
    }
    
    .feedback-ribbon__remove-button, .feedback-ribbon__remove-button-dark
    {
    	border: none;
    }
    
    .feedback-ribbon__remove-button:hover, .feedback-ribbon__remove-button-dark:hover
    {
    	cursor: pointer;
    }
    
    .feedback-ribbon__remove-button
    {
    	background-color: #d3d3d3;
    }
    
    .feedback-ribbon__remove-button:hover
    {
    	background-color: #c3c3c3;
    }
    
    .feedback-ribbon__remove-button:active
    {
    	background-color: #b3b3b3;
    }
    
    .feedback-ribbon__remove-button-dark
    {
    	background-color: #282828;
      color: #f5f5f5;
    }
    
    .feedback-ribbon__remove-button-dark:hover
    {
    	background-color: #383838;
    }
    
    .feedback-ribbon__remove-button-dark:active
    {
    	background-color: #484848;
    }
    
    .feedback-ribbon__progress-bar-wrapper, feedback-ribbon__progress-bar-wrapper-dark
    {
    	height: 10px;
    }
    
    .feedback-ribbon__progress-bar-wrapper
    {
    	background-color: #c0c0c0;
    }
    
    .feedback-ribbon__progress-bar-wrapper-dark
    {
    	background-color: #383838;
    }
    
    .feedback-ribbon__progress-bar, .feedback-ribbon__progress-bar-dark
    {
    	background-color: #C00000;
      height: 10px;
      width: 0px;
      transition-duration: 1000ms;
      transition-timing-function: linear;
    }
  </style>
  <div id="ribbon-progress-wrapper" class="feedback-ribbon__ribbon-progress-wrapper">
    <div id="ribbon-wrapper" class="feedback-ribbon__ribbon-wrapper">
      <div id="color-sidebar" class="feedback-ribbon__color-sidebar"></div>
      <div class="feedback-ribbon__feedback-text-wrapper">
        <slot class="feedback-ribbon__feedback-text">Put your feedback here</slot>
      </div>
      <button id="remove-button" class="feedback-ribbon__remove-button">
      	&times;
      </button>
    </div>
    <div id="progress-bar-wrapper" class="feedback-ribbon__progress-bar-wrapper">
    	<div id="progress-bar" class="feedback-ribbon__progress-bar"></div>
    </div>
  </div>
`;

//Constant for the observed attributes of the component
const colorAttribute = 'color';
const darkAttribute = 'dark';
const durationAttribute = 'duration';
const removableAttribute = 'removable';
const attributes = [colorAttribute, darkAttribute, durationAttribute, removableAttribute];

//Helper funcion for recursing child elements
function getChildrenRecursive(element, includeElement=true)
{
	//Instantiate a list of children
  var recursiveChildren = [];
  
  //If the element passed in is to be included, then append it to the list
  if(includeElement)
  {
  	recursiveChildren.push(element);
  }
  
	//Check if the element has children, if not return an empty list
  if (element.children.length === 0)
  {
  	return recursiveChildren;
  }
  
  //Loop through the element's children
  for(var i = 0; i < element.children.length; i++)
  {
  	//Add the child element to the list
    recursiveChildren.push(element.children[i]);
    
    //Get the child element's children and append them to the list
    var subChildren = getChildrenRecursive(element.children[i]);
    recursiveChildren.push.apply(recursiveChildren, subChildren);
  }
  
  //Return the flattened list of subChildren
  return recursiveChildren;
}

//Define the WACTFeedbackRibbon class
class WACTFeedbackRibbon extends HTMLElement
{
	//Constructor for WACTFeedbackRibbon class
  //Runs on instantiation of the WACTFeedbackRibbon object
	constructor()
    {
        super();

        //Instantiate the shadow root and append the template to the
        //shadow root
        this.root = this.attachShadow({ "mode" : "open" });
        var clone = wactFeedbackRibbonTemplate.content.cloneNode(true);
        this.root.append(clone);

        //Instantiate the timeout for the progress bar incrementation
        //function
        this.incrementTimeout = null;

        //Set the onClick function for the remove button
        var removeButton = this.root.getElementById("remove-button");
        removeButton.addEventListener("click", this.removeElement.bind(this));

        //Remove the progress bar if the duration value is not set
        if(this.duration == null)
        {
            this.removeProgressbar();
        }

        //Remove the button if the removable value is not set
        if(!this.removable)
        {
            this.removeRemoveButton();
        }
    }

    //Define the allowed custom attributes
    static get observedAttributes()
    {
        return attributes;
    }

    //Define a getter for the color attribute
    get color()
    {
        return this.getAttribute('color');
    }

    //Define a setter for the color attribute
    set color(value)
    {
        this.setAttribute('color', value);
    }

    //Define a getter for the dark attribute
    get dark()
    {
        return this.hasAttribute('dark');
    }

    //Define a setter for the dark attribute
    set dark(value)
    {
        if(value)
        {
            this.setAttribute('dark', value);
        }
        else
        {
            this.removeAttribute('dark');
        }
    }

    //Define a getter for the duration attribute
    get duration()
    {
        if(!this.hasAttribute('duration'))
        {
            return null;
        }
        return Number(this.getAttribute('duration'));
    }

    //Define a setter for the duration attribute
    set duration(value)
    {
        this.setAttribute('duration', Number(value));
    }

    //Handle switching to dark mode
    toggleDarkMode(previousValue, newValue)
    {
        //Get the ribbon wrapper element and recurse its children
        var wrapper = this.root.getElementById("ribbon-progress-wrapper");
        var wrapperChildren = getChildrenRecursive(wrapper);

        //Loop through the flattened list of children
        for(var i = 0; i < wrapperChildren.length; i++)
        {
            //Get the child element
            var wrapperChild = wrapperChildren[i];
            var wrapperChildClass = wrapperChild.getAttribute("class");

            //If the new value is true, then update the class name
            //for each element to append the -dark suffix
            if(this.dark)
            {
                if(wrapperChildClass.endsWith("-dark"))
                {
                    continue;
                }
                wrapperChild.setAttribute("class", wrapperChildClass + "-dark");
            }
            //If the new value is false, then check the class name
            //for each element and remove the -dark suffix
            else
            {
                if(!wrapperChildClass.endsWith("-dark"))
                {
                    continue;
                }
                wrapperChild.setAttribute("class", wrapperChildClass + "-dark");
            }
        }
    }

    //Handle updating the color assigned to the message
    toggleColor(previousValue, newValue)
    {
        //Get the color sidebar of the component
        var sidebar = this.root.getElementById("color-sidebar");
        var progressbar = this.root.getElementById("progress-bar");

        //Overwrite the color value of the sidebar
        sidebar.style.backgroundColor = newValue;
        progressbar.style.backgroundColor = newValue;
    }

    //Handle removing the progress bar
    removeProgressbar()
    {
        //Get the progress bar and set its display to none
        var progressbar = this.root.getElementById("progress-bar");
        progressbar.style.display = "none";

        //Get the progress bar wrapper and set its display to none
        var progressbarWrapper = this.root.getElementById("progress-bar-wrapper");
        progressbarWrapper.style.display = "none";
    }

    //Handle removing the progress bar
    addProgressbar()
    {
        //Get the progress bar wrapper and set its display to block
        var progressbarWrapper = this.root.getElementById("progress-bar-wrapper");
        progressbarWrapper.style.display = "block";

        //Get the progress bar and set its display to block
        var progressbar = this.root.getElementById("progress-bar");
        progressbar.style.display = "block";
    }

    //Handle incrementing the progress bar
    incrementProgressbar(timeElapsed=0) {
        //Get the progress bar element, get its current width
        var progressbar = this.root.getElementById("progress-bar");

        //Calculate the new width of the progress bar using the elapsed
        //time and total time
        var progressbarNewWidth = ((timeElapsed + 1) / this.duration)*100;

        //Animate the incrementation of the progress bar
        window.requestAnimationFrame(function(){
            progressbar.style.width = progressbarNewWidth + "%";
        });


        //If there is still progress to be made, then re-run the function
        //in 1 second
        var thisClass = this;
        if((timeElapsed + 1) < this.duration) {
            thisClass.incrementTimeout = setTimeout(function(){
            thisClass.incrementProgressbar(timeElapsed + 1);
            }, 1000);
        }
        else
        {
            thisClass.incrementTimeout = setTimeout(function(){
            thisClass.removeElement();
            }, 1000);
        }
    }

    //Handle values and changes to the attributes
    attributeChangedCallback(attribute, previousValue, newValue)
    {
    if (attribute.toLowerCase() === darkAttribute)
    {
        this.toggleDarkMode(previousValue, newValue);
    }
    if (attribute.toLowerCase() === colorAttribute)
    {
        this.toggleColor(previousValue, newValue);
    }
    if (attribute.toLowerCase() === durationAttribute)
    {
        if(newValue == null)
        {
            this.removeProgressbar();
            return;
        }
        if(previousValue == null && newValue != null)
        {
            this.addProgressbar();
        }
        if(this.incrementTimeout == null)
        {
            this.incrementTimeout = setTimeout(this.incrementProgressbar.bind(this), 100);
        }
    }
    if (attribute.toLowerCase() === removableAttribute)
    {
        if(newValue == null)
        {
            this.removeRemoveButton();
            return;
        }
        if(previousValue == null && newValue != null)
        {
            this.addRemoveButton();
        }
    }
    }

    //Handle adding the remove button
    addRemoveButton()
    {
        //Get the remove button and set its display to block
        var removeButton = this.root.getElementById("remove-button");
        removeButton.style.display = "block";

        //Get the ribbon wrapper and update its grid template columns
        var ribbonWrapper = this.root.getElementById("ribbon-wrapper");
        ribbonWrapper.style.gridTemplateColumns = "2% 90% 8%";
    }

    //Handle removing the remove button
    removeRemoveButton()
    {
        //Get the remove button and set its display to none
        var removeButton = this.root.getElementById("remove-button");
        removeButton.style.display = "none";

        //Get the ribbon wrapper and update its grid template columns
        var ribbonWrapper = this.root.getElementById("ribbon-wrapper");
        ribbonWrapper.style.gridTemplateColumns = "2% 98%";
    }

    //Handle removing the element from the dom
    removeElement()
    {
        clearTimeout(this.incrementTimeout);
        this.remove();
    }
}

window.customElements.define("wact-feedback-ribbon", WACTFeedbackRibbon);