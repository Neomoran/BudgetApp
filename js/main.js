//usimg javascript es6 class syntax
//classes have class name and {}
//We shall set the variable equal to anew UI
//Then we shall get the instance of that class
//Whenever we have a class, we also have an option for constructor method that is gonna run every time we instantiate the class
class UI {
  constructor() {
    //properties
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemId = 0;
  }
  //methods
  //creating methods step by step in the ui class
  //When we submit the form, the value should not be 0 or less than 0, when everything is fine, show balance and budget amount

  //submit budget method
  submitBudgetForm() {
    //console.log("Hello es6");
    //get the value
    const value = this.budgetInput.value;
    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p>Sorry! You can't budget nothing. <i class = 'fas fa-exclamation-triangle'></i></p>`;
      //make setTimeout 'this' point to the ui
      //it point to the window object since its not a function within the ui class
      //using self makes it point to the ui class
      const self = this;
      //console.log(this); //points back to ui class
      setTimeout(function() {
        //console.log(this); //points back to window object
        //console.log(self); //points back to ui class now
        self.budgetFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      //show the budget value
      this.budgetAmount.textContent = value;
      //remove the value on input
      this.budgetInput.value = "";
      this.showBalance();
    }
  }

  //show balance method
  showBalance() {
    //console.log(`hey bro this is your balance`);
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.remove("showBlack", "showGreen");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  //submit expense method
  submitExpenseForm() {
    //value of expenses entered
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>Type and Cost of Expense cannot be blank or negative <i class = 'fas fa-exclamation-triangle'></i></p>`;
      const self = this;
      setTimeout(function() {
        self.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      //create an object
      let expense = {
        id: this.itemId,
        title: expenseValue,
        amount: amount
      };
      this.itemId++;
      this.itemList.push(expense);
      //display expense
      this.addExpense(expense);
      this.showBalance();
    }
  }
  //add expense method
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class ="expense-item d-flex justify-content-between align-items-baseline">
    <h5 class = "expense-title mb-0  list-item">${expense.title}</h5>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
    <div class='expense-icons list-item'>
    <a href="#" class = "edit-icon mx-2" data-id="${expense.id}">
    <i class = "fas fa-edit"></i>
    </a>
    <a href="#" class = "delete-icon mx-2" data-id="${expense.id}">
    <i class = "fas fa-trash"></i>
    </a>
    </div>
    </div>
    `;
    this.expenseList.appendChild(div);
  }

  //total expense method
  //calculates everything in pur expense list
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      //using reduce() that returns a number
      //it takes in a callback() that takes two parameters accumulator and current
      total = this.itemList.reduce(function(acc, curr) {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    //when no item is in expense list, the expense amount is 0
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit expense method
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
    this.expenseList.removeChild(parent);
    //remove from the dom
    //use the filter() to find the item that has the above id as attribute
    let expense = this.itemList.filter(function(item) {
      return item.id === id;
    });
    //show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //remove from item list
    let tempList = this.itemList.filter(function(item) {
      //return rest of items that dont have an id
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
  //delete expense method
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
    this.expenseList.removeChild(parent);
    //remove from item list
    let tempList = this.itemList.filter(function(item) {
      //return rest of items that dont have an id
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
}

//outside the class

//function of event listeners which will run as the DOM loads
function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //new instance of class UI
  //we can access the properties in the class UI
  const ui = new UI();

  //budget-form submit
  budgetForm.addEventListener("submit", function(event) {
    //The form would be automatically submitting so we prevent that with event.preventDefault();
    event.preventDefault();
    //submit the budget form
    ui.submitBudgetForm();
  });
  //expense-form submit
  expenseForm.addEventListener("submit", function(event) {
    //The form would be automatically submitting so we prevent that with event.preventDefault();
    event.preventDefault();
    //submit the expense form
    ui.submitExpenseForm();
  });
  //expense-list click
  expenseList.addEventListener("click", function(event) {
    //console.log(e.target);
    if (event.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  eventListeners();
});

//the calculator modal
//Get the modal element
let modal = document.getElementById("simpleModal");
//Get the modal button
let modalBtn = document.getElementById("modalBtn");
//Get the close button
let closeBtn = document.getElementById("closeBtn");
//Listen for open click
modalBtn.addEventListener("click", openModal);
//Listen for open click
closeBtn.addEventListener("click", closeModal);
//Listen for outside click
window.addEventListener("click", clickOutside);
//Function to open the modal
function openModal() {
  modal.style.display = "block";
}
//Function to close the modal
function closeModal() {
  modal.style.display = "none";
}
//Function to close modal if outside click
function clickOutside(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

//calculator
//get all buttons
const btns = document.querySelectorAll(".btnA");
//get the input i.e .screen
const screen = document.querySelector(".screen");
//get the equal sign button
const equalBtn = document.querySelector(".btn-equal");
//get the clear button
const clearBtn = document.querySelector(".btn-clear");

//Loop through all other buttons then add event listener
btns.forEach(function(everyBtn) {
  everyBtn.addEventListener("click", function() {
    //on click show the number or value on each button
    //shown by the value of the attribute.
    let number = everyBtn.getAttribute("data-num");
    screen.value += number;
  });
});

//Making the equal button do its work
equalBtn.addEventListener("click", function() {
  //if value on screen is empty, print 'enter values'
  if (screen.value === "") {
    screen.value = `please enter a value`; //template literal
  } else {
    //if there are values on screen, evaluate using the eval()
    let evaluation = eval(screen.value);
    screen.value = evaluation;
  }
});

//Make the clear button do its work too
clearBtn.addEventListener("click", function() {
  screen.value = "";
});


