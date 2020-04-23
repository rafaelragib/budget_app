//budget module
var budgetController = (function() {

})();



//ui module
var UIController = (function() {
	
	var DOMstrings={
		input:'.add__btn',
		typeVal: '.add__type',
		descriptionVal : '.add__description',
		inputVal:'.add__value'
	}

	return	{
		getInputVal: function() 
		{
			return {
			typeval: document.querySelector(DOMstrings.typeVal).value,
			descriptionval: document.querySelector(DOMstrings.descriptionVal).value,
			inputval : document.querySelector(DOMstrings.inputVal).value
			};	

		},
		getDOMstrings: function()
		{
			return DOMstrings;
		}
	};


})();

//controller module
var controller = (function(budgetCntrl,uiCntrl) {

var DOM= uiCntrl.getDOMstrings();



addItemfn=function()
{
	console.log(uiCntrl.getInputVal());
}

document.querySelector(DOM.input).addEventListener('click', addItemfn);


document.addEventListener('keypress',function(event){

    if(event.keyCode===13)
        addItemfn();

});



})(budgetController,UIController);
