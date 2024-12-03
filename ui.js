document.addEventListener("DOMContentLoaded", () => {
    const transactionList = document.getElementById("transactions");
    const filterType = document.getElementById("filterType");
    const filterCustomType = document.getElementById("filterCustomType");
    const filterDateStart = document.getElementById("filterDateStart");
    const filterDateEnd = document.getElementById("filterDateEnd");
    const addRecordForm = document.getElementById("addRecordForm");
    const balanceDisplay = document.getElementById("balance");
    const applyFilterButton = document.getElementById("applyFilter");

    function renderTransactions(transactions) {
        transactionList.innerHTML = "";
        transactions.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = `${entry.amount} ${entry.valuta.name} - ${entry.type.name} - ${entry.date}`;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-3");
            deleteButton.textContent = "Удалить";
            deleteButton.addEventListener("click", () => handleDeleteTransaction(entry, index));

            listItem.appendChild(deleteButton);
            transactionList.appendChild(listItem);
        });
    }

    function handleDeleteTransaction(entry, index) {
        if (entry instanceof Income) {
            myBudget.removeIncome(index);
        } else if (entry instanceof Expense) {
            myBudget.removeExpense(index);
        }

        renderTransactions(myBudget.incomes.concat(myBudget.expenses));
        updateBalance();
    }

    function updateBalance() {
        const startDate = filterDateStart.value;
        const endDate = filterDateEnd.value;
        const balanceText = myBudget.calculateBalance(startDate, endDate);

        balanceDisplay.textContent = balanceText;
    }

    addRecordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const customTypeName = document.getElementById("customTypeName").value;
        const date = document.getElementById("date").value;
        const valuta = myBudget.valutas.find(v => v.name === document.getElementById("valuta").value);

        let customType;

        if (type === "income") {
            customType = myBudget.incomeTypes.find(t => t.name === customTypeName) ||
                myBudget.addIncomeType(customTypeName);
            myBudget.addIncome(amount, customType, date, valuta);
        } else {
            customType = myBudget.expenseTypes.find(t => t.name === customTypeName) ||
                myBudget.addExpenseType(customTypeName);
            myBudget.addExpense(amount, customType, date, valuta);
        }

        renderTransactions(myBudget.incomes.concat(myBudget.expenses));
        updateBalance();
        addRecordForm.reset();
    });
    applyFilterButton.addEventListener("click", () => {
        const type = filterType.value;
        const customTypeName = filterCustomType.value.toLowerCase();
        const startDate = filterDateStart.value;
        const endDate = filterDateEnd.value;

        let filtered = myBudget.incomes.concat(myBudget.expenses).filter(entry => {
            const matchesType = (type === "all") || (type === "income" && entry instanceof Income) || (type === "expense" && entry instanceof Expense);
            const matchesCustomType = !customTypeName || entry.type.name.toLowerCase().includes(customTypeName);
            const matchesDate = (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
            return matchesType && matchesCustomType && matchesDate;
        });

        renderTransactions(filtered);
        updateBalance();
    });
    updateBalance();
});
