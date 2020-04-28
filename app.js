//budget module
var budgetController = (function() {

	var Expense= function(id,descriptionval,value)
	{
		this.id=id;
		this.descriptionval=descriptionval;
		this.value=value;
		this.percentage=-1;
	};
	
	Expense.prototype.calcuPercent = function(totalIncome)
	{
		if(totalIncome>0)
			this.percentage=Math.round((this.value/totalIncome)*100);
		else 
			this.percentage=-1;
	};

	Expense.prototype.getPercent = function()
	{
		return  this.percentage;
	};
	


	var Income= function(id,descriptionval,value)
	{
		this.id=id;
		this.descriptionval=descriptionval;
		this.value=value;
	};	
	
	var calculate =function(type)
	{
		var total=0;

		data.allItem[type].forEach(function(cur){
			total+=cur.value;
		});

		data.totals[type]=total;
	}


	var data={
		allItem:{
			exp: [],
			inc: []
		},
		totals:
		{
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage:-1
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


		calculateBudget:function()
		{
			//calculate income and expanse
			calculate('inc');
			calculate('exp');

			//calculate budget
			data.budget = data.totals.inc-data.totals.exp;

			//calculate percentage
			if(data.totals.inc>0)
				data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);

		},


		getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },


        deleteItem: function(type,id)
		{
			var mapid = data.allItem[type].map(function(current) {
                return current.id;
            });

			var index= mapid.indexOf(id);
			data.allItem[type].splice(index,1);			
		},

		calculatepercent: function()
		{
			data.allItem.exp.forEach(function(current)
			{
				current.calcuPercent(data.totals.inc);
			});

		},


		getpercent: function()
		{
			var allpercent= data.allItem.exp.map(function(current)
				{
					return current.getPercent();

				});
			return allpercent;
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
		expanseList:'.expenses__list',
		display_budget:'.budget__value',
		display_income :'.budget__income--value',
		display_expense: '.budget__expenses--value',
		display_percentage: '.budget__expenses--percentage',
		select_container:'.container',
		select_percent:'.item__percentage',
		dateLabel:'.budget__title--month'
	};

	var formatNumber= function(num,type)
	{
			var numSplit,int,dec,type;

			num=Math.abs(num);
			num=num.toFixed(2);

			numSplit=num.split('.');

			int =numSplit[0];
			if(int.length>3)
			{
				int =int.substr(0,int.length-3)+','+int.substr(int.length-3,3);

			}
			dec=numSplit[1];
			
			type=== 'exp'? sign='-' : sign='+';
			
			return sign+' ' +int+ '.'+dec;

	};

	var nodeListforEach=function(list,callback)
			{
				for(var i=0;i<list.length;i++)
				{
					callback(list[i],i);
				}
			};


	return	{

		//input values
		getInputVal: function() 
		{
			return {
			typeval: document.querySelector(DOMstrings.typeVal).value,
			descriptionval: document.querySelector(DOMstrings.descriptionVal).value,
			inputval : parseFloat(document.querySelector(DOMstrings.inputVal).value)
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
				html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				element=DOMstrings.incomeList;
			}
			else{
				html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				element=DOMstrings.expanseList;
			}
			
			//replace the placeholder with actual data
			newhtml=html.replace('%id%',obj.id);
			newhtml=newhtml.replace('%desc%',obj.descriptionval);
			newhtml=newhtml.replace('%val%',formatNumber(obj.value,type));


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
		},


		displayBudget: function(obj)
		{
			obj.budget> 0 ? type='inc':type= 'exp';
			document.querySelector(DOMstrings.display_income).textContent=formatNumber(obj.totalInc,'inc');
			document.querySelector(DOMstrings.display_expense).textContent=formatNumber(obj.totalExp,'exp');
			//document.querySelector(DOMstrings.display_percentage).textContent=obj.percentage;
			document.querySelector(DOMstrings.display_budget).textContent=formatNumber(obj.budget,type);
			if(obj.percentage>0)
				document.querySelector(DOMstrings.display_percentage).textContent=obj.percentage +' %';
			else
				document.querySelector(DOMstrings.display_percentage).textContent='---';
			

		},

		clearItem: function(itemID)
		{
			var el= document.getElementById(itemID);
			el.parentNode.removeChild(el);
		},

		displaypercentage: function(percent)
		{
			var fields= document.querySelectorAll(DOMstrings.select_percent);

			

			nodeListforEach(fields,function(current,index)
			{
				if(percent[index]>0)
					current.textContent= percent[index] +' %';
				else
					current.textContent= '---';
			});
		},

		displayMonth: function()
		{
			var now,year;
			now=new Date();
			var monthNames = ["January", "February", "March", "April", "May", "June",
  								"July", "August", "September", "October", "November", "December"];

			year=now.getFullYear();
			month=now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent=monthNames[month]+' '+ year;
		},

		changeType:function()
		{
			var field= document.querySelectorAll(
				DOMstrings.typeVal+','+
				DOMstrings.descriptionVal +','+
				DOMstrings.inputVal);

			nodeListforEach(field,function(cur){

				cur.classList.toggle('red-focus')
			});
	
			document.querySelector(DOMstrings.input).classList.toggle('red');

		}





			 
	};


})();

//controller module
var controller = (function(budgetCntrl,uiCntrl) {

	var DOM= uiCntrl.getDOMstrings();


	//update budget
	var updateBudget= function()
	{
		//calculate all the budget values
		budgetCntrl.calculateBudget();

		//return the budget values
		var budget=budgetCntrl.getBudget()

		//display budget
		uiCntrl.displayBudget(budget);
	}

	//add item in the income or expanse list
	var addItemfn = function()
	{
		//take input values from ui
		var inputvalues=uiCntrl.getInputVal();

		if(inputvalues.descriptionval!=="" && !isNaN(inputvalues.inputval)){

			//add the input values with the budget contoller module
			newitem=budgetCntrl.addItem(inputvalues.typeval,inputvalues.descriptionval,inputvalues.inputval);
		
			//add item in UI
			uiCntrl.createListItem(inputvalues.typeval,newitem);
		
			//clear input fields
			uiCntrl.clearelement();

			//calculate budget
			updateBudget();	

			//calculate percentage
			percentlist();
	
	}


	};


	//create percentage for every expense list
	var percentlist = function()
	{
		budgetCntrl.calculatepercent();

		var percentage=budgetCntrl.getpercent();

		UIController.displaypercentage(percentage);
	}

	var deletefn = function(event)
	{
		//console.log();
		if(event.target.className==='ion-ios-close-outline'){
			var selected= event.target.parentNode.parentNode.parentNode.parentNode.id;
			selectedar=selected.split('-');
			var type =selectedar[0];
			var id =parseInt(selectedar[1]);
			console.log(type);
			

			budgetController.deleteItem(type,id);


			UIController.clearItem(selected);

			updateBudget();
		}
			
	}

	var setupEventKey =function()
	{
		document.querySelector(DOM.input).addEventListener('click', addItemfn);


		document.addEventListener('keypress',function(event){

    	if(event.keyCode===13)
        	addItemfn();
		});	

		//delete event listener
		//console.log(DOM.select_container);
		document.querySelector(DOM.select_container).addEventListener('click', deletefn);
		document.querySelector(DOM.typeVal).addEventListener('change', uiCntrl.changeType);
		
	}

return {
    	init: function()
    	{
    		setupEventKey();
    		uiCntrl.displayBudget({budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0});

    		UIController.displayMonth();

    	}
    }


})(budgetController,UIController);

controller.init();