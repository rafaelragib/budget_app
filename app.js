//budget module
var budgetController = (function() {

	var Expense= function(id,descriptionval,value)
	{
		this.id=id;
		this.descriptionval=descriptionval;
		this.value=value;
	};
	
	var Income= function(id,descriptionval,value)
	{
		this.id=id;
		this.descriptionval=descriptionval;
		this.value=value;
	};	
	

	var data={
		allItem:{
			exp: [],
			inc: []
		},
		totals:
		{
			exp: 0,
			inc: 0
		}
	};
	
	return	{
		addItem:function(type,desc,val)
		{
			var newItem; 
			var new_id;
			if(data.allItem[type].length>0)
				new_id= data.allItem[type][data.allItem[type].length-1].id+1;
			else
				new_id=0;
				
			if(type==='inc')
			{
				console.log('ENTER');
				newItem= new Income(new_id,desc,val);
			}
			else {
				newItem= new Expense(new_id,desc,val);
			}

			data.allItem[type].push(newItem);
			return newItem;
		},

		//input values
		testing: function() 
		{
			console.log(data);	

		}
		
	};


})();



//ui module
var UIController = (function() {
	
	//dom values in ui
	var DOMstrings={
		input:'.add__btn',
		typeVal: '.add__type',
		descriptionVal : '.add__description',
		inputVal:'.add__value',
		incomeList:'.income__list',
		expanseList:'.expenses__list'
	}

	return	{

		//input values
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
		},
		createListItem: function(type,obj)
		{
			var element,html,newhtml;

			//create the html strings for the new data
			if(type==='inc'){
				html='<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				element=DOMstrings.incomeList;
			}
			else{
				html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				element=DOMstrings.expanseList;
			}
			
			//replace the placeholder with actual data
			newhtml=html.replace('%id%',obj.id);
			newhtml=newhtml.replace('%desc%',obj.descriptionval);
			newhtml=newhtml.replace('%val%',obj.value);


			//insert new html in the html file
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

		},
		clearelement: function()
		{
			var elements;

			elements=document.querySelectorAll(DOMstrings.descriptionVal+', '+DOMstrings.inputVal);

			elements=Array.prototype.slice.call(elements);

			elements.forEach(function(current,index,array)
			{
				current.value="";
			});
			elements[0].focus();
		}

	};


})();

//controller module
var controller = (function(budgetCntrl,uiCntrl) {

	var DOM= uiCntrl.getDOMstrings();

	var addItemfn = function()
	{
		//take input values from ui
		var inputvalues=uiCntrl.getInputVal();
		//add the input values with the budget contoller module
		newitem=budgetCntrl.addItem(inputvalues.typeval,inputvalues.descriptionval,inputvalues.inputval);
		//add item in UI
		uiCntrl.createListItem(inputvalues.typeval,newitem);
		//clear input fields
		uiCntrl.clearelement();


	}
	document.querySelector(DOM.input).addEventListener('click', addItemfn);


	document.addEventListener('keypress',function(event){

    if(event.keyCode===13)
        addItemfn();

});



})(budgetController,UIController);
