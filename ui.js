document.addEventListener("DOMContentLoaded", () => {
    const transactionList = document.getElementById("transactions");
    const filterType = document.getElementById("filterType");
    const filterCustomType = document.getElementById("filterCustomType");
    const filterDateStart = document.getElementById("filterDateStart");
    const filterDateEnd = document.getElementById("filterDateEnd");
    const addRecordForm = document.getElementById("addRecordForm");

    function renderTransactions(transactions) {
        transactionList.innerHTML = "";
        transactions.forEach((entry) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = `${entry.amount} ${entry.valuta.name} - ${entry.type.name} - ${entry.date}`;
            transactionList.appendChild(listItem);
        });
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
        addRecordForm.reset();
    });

    document.getElementById("applyFilter").addEventListener("click", () => {
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
    });

    renderTransactions(myBudget.incomes.concat(myBudget.expenses));
});
