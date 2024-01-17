const app = {
  amounts: {
    total: 0,
    expenses: 0,
    revenues: 0,
  },
  lists: {
    expenses: [],
    revenues: [],
  },
  outputs: {
    total: document.getElementById("total"),
    totalExpenses: document.getElementById("expenses"),
    totalRevenues: document.getElementById("revenues"),
    expenses: document.getElementById("expense-list"),
    revenues: document.getElementById("revenue-list"),
  },
  inputs: {
    expenseForm: document.getElementById("expense-form"),
    revenueForm: document.getElementById("revenue-form"),
  },
};

const listItemTemplate = document.getElementById("list-item");

function updateOutputs() {
  app.amounts.expenses = app.lists.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  app.amounts.revenues = app.lists.revenues.reduce(
    (sum, revenue) => sum + revenue.amount,
    0
  );
  app.amounts.total = app.amounts.revenues - app.amounts.expenses;

  const total = app.amounts.total;
  if (total > 0) {
    app.outputs.total.innerText = "Możesz jeszcze wydać " + total + " złotych.";
  } else if (total < 0) {
    app.outputs.total.innerText =
      "Bilans jest ujemny. Jesteś na minusie " + total + " złotych.";
  } else {
    app.outputs.total.innerText = "Bilans wynosi zero.";
  }

  app.outputs.totalExpenses.innerText = app.amounts.expenses;
  app.outputs.totalRevenues.innerText = app.amounts.revenues;

  app.outputs.revenues.innerHTML = "";
  app.lists.revenues.forEach((revenue, n) => {
    const item = listItemTemplate.content.cloneNode(true);
    item.querySelector(".name").innerText = revenue.name;
    item.querySelector(".amount").innerText = revenue.amount;
    item.querySelector(".remove").addEventListener("click", () => {
      removeRevenue(n);
    });
    item.querySelector(".edit").addEventListener("click", () => {
      editRevenue(n);
    });
    app.outputs.revenues.appendChild(item);
  });

  app.outputs.expenses.innerHTML = "";
  app.lists.expenses.forEach((expense, n) => {
    const item = listItemTemplate.content.cloneNode(true);
    item.querySelector(".name").innerText = expense.name;
    item.querySelector(".amount").innerText = expense.amount;
    item.querySelector(".remove").addEventListener("click", () => {
      removeExpense(n);
    });
    item.querySelector(".edit").addEventListener("click", () => {
      editExpense(n);
    });
    app.outputs.expenses.appendChild(item);
  });

  console.log(app);
}

function addRevenue(e) {
  e.preventDefault();
  const formData = new FormData(app.inputs.revenueForm);
  const data = Object.fromEntries(formData.entries());
  app.lists.revenues.push({
    name: data.name,
    amount: Number(data.amount),
  });
  app.inputs.revenueForm.reset();
  updateOutputs();
}

function addExpense(e) {
  e.preventDefault();
  const formData = new FormData(app.inputs.expenseForm);
  const data = Object.fromEntries(formData.entries());
  app.lists.expenses.push({
    name: data.name,
    amount: Number(data.amount),
  });
  app.inputs.expenseForm.reset();
  updateOutputs();
}

function removeRevenue(n) {
  app.lists.revenues.splice(n, 1);
  updateOutputs();
}

function removeExpense(n) {
  app.lists.expenses.splice(n, 1);
  updateOutputs();
}

function editRevenue(n) {
  const [revenue] = app.lists.revenues.splice(n, 1);
  app.inputs.revenueForm.elements.name.value = revenue.name;
  app.inputs.revenueForm.elements.amount.value = revenue.amount;
  updateOutputs();
}

function editExpense(n) {
  const [expense] = app.lists.expenses.splice(n, 1);
  app.inputs.expenseForm.elements.name.value = expense.name;
  app.inputs.expenseForm.elements.amount.value = expense.amount;
  updateOutputs();
}

function init() {
  updateOutputs();
}

app.inputs.revenueForm.addEventListener("submit", addRevenue);
app.inputs.expenseForm.addEventListener("submit", addExpense);

init();
