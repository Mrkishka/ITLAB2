class Course {
    constructor(buy, sell, date) {
        this.buy = buy; // Курс покупки
        this.sell = sell; // Курс продажи
        this.date = date; // Дата курса
    }
}

class Valuta {
    constructor(name) {
        this.name = name; // Наименование валюты
        this.courses = []; // Массив курсов (объектов класса Course)
    }

    addCourse(buy, sell, date) {
        this.courses.push(new Course(buy, sell, date));
    }

    getCourseByDate(date) {
        return this.courses.find(course => course.date === date);
    }
}

class ExpenseType {
    constructor(name) {
        this.name = name; // Наименование типа расхода
    }
}

class IncomeType {
    constructor(name) {
        this.name = name; // Наименование типа дохода
    }
}

class Expense {
    constructor(amount, type, date, valuta) {
        this.amount = amount; // Сумма расхода
        this.type = type; // Тип расхода (объект ExpenseType)
        this.date = date; // Дата расхода
        this.valuta = valuta; // Валюта (объект Valuta)
    }
}

class Income {
    constructor(amount, type, date, valuta) {
        this.amount = amount; // Сумма дохода
        this.type = type; // Тип дохода (объект IncomeType)
        this.date = date; // Дата дохода
        this.valuta = valuta; // Валюта (объект Valuta)
    }
}

class Budget {
    constructor() {
        this.valutas = []; // Массив валют
        this.expenseTypes = []; // Массив типов расходов
        this.incomeTypes = []; // Массив типов доходов
        this.expenses = []; // Массив расходов
        this.incomes = []; // Массив доходов
    }

    // Добавление валюты
    addValuta(name) {
        const valuta = new Valuta(name);
        this.valutas.push(valuta);
        return valuta;
    }

    // Добавление типа расхода
    addExpenseType(name) {
        const type = new ExpenseType(name);
        this.expenseTypes.push(type);
        return type;
    }

    // Добавление типа дохода
    addIncomeType(name) {
        const type = new IncomeType(name);
        this.incomeTypes.push(type);
        return type;
    }

    // Добавление расхода
    addExpense(amount, type, date, valuta) {
        const expense = new Expense(amount, type, date, valuta);
        this.expenses.push(expense);
        return expense;
    }

    // Добавление дохода
    addIncome(amount, type, date, valuta) {
        const income = new Income(amount, type, date, valuta);
        this.incomes.push(income);
        return income;
    }

    // Удаление дохода по индексу
    removeIncome(index) {
        if (index >= 0 && index < this.incomes.length) {
            this.incomes.splice(index, 1);
            console.log(`Доход удален.`);
        } else {
            console.log("Неверный индекс дохода.");
        }
    }

    // Удаление расхода по индексу
    removeExpense(index) {
        if (index >= 0 && index < this.expenses.length) {
            this.expenses.splice(index, 1);
            console.log(`Расход удален.`);
        } else {
            console.log("Неверный индекс расхода.");
        }
    }

    // Обновление дохода
    updateIncome(index, amount, type, date, valuta) {
        if (index >= 0 && index < this.incomes.length) {
            this.incomes[index] = new Income(amount, type, date, valuta);
            console.log(`Доход обновлен.`);
        } else {
            console.log("Неверный индекс дохода.");
        }
    }

    // Обновление расхода
    updateExpense(index, amount, type, date, valuta) {
        if (index >= 0 && index < this.expenses.length) {
            this.expenses[index] = new Expense(amount, type, date, valuta);
            console.log(`Расход обновлен.`);
        } else {
            console.log("Неверный индекс расхода.");
        }
    }

    // Метод для расчета баланса по каждой валюте
    calculateBalance(startDate = null, endDate = null) {
        // Создаем объекты для хранения баланса по каждой валюте
        const incomeByCurrency = {};
        const expenseByCurrency = {};

        // Фильтруем и суммируем доходы по валютам
        this.incomes.forEach(income => {
            if ((startDate && income.date < startDate) || (endDate && income.date > endDate)) {
                return; // Пропускаем доходы вне периода
            }
            const currency = income.valuta.name;
            if (!incomeByCurrency[currency]) incomeByCurrency[currency] = 0;
            incomeByCurrency[currency] += income.amount;
        });

        // Фильтруем и суммируем расходы по валютам
        this.expenses.forEach(expense => {
            if ((startDate && expense.date < startDate) || (endDate && expense.date > endDate)) {
                return; // Пропускаем расходы вне периода
            }
            const currency = expense.valuta.name;
            if (!expenseByCurrency[currency]) expenseByCurrency[currency] = 0;
            expenseByCurrency[currency] += expense.amount;
        });

        // Вычисляем баланс по каждой валюте и выводим его
        console.log(`Баланс за период${startDate && endDate ? ` с ${startDate} по ${endDate}` : ""}:`);
        Object.keys(incomeByCurrency).forEach(currency => {
            const totalIncome = incomeByCurrency[currency] || 0;
            const totalExpense = expenseByCurrency[currency] || 0;
            const balance = totalIncome - totalExpense;
            console.log(`Баланс в ${currency}: ${balance.toFixed(2)} ${currency}`);
        });
    }

    // Фильтрация доходов/расходов за период с фильтром по типу
    filterTransactions(startDate, endDate, typeFilter = null, isIncome = true) {
        const transactions = isIncome ? this.incomes : this.expenses;
        const filtered = transactions.filter(entry =>
            entry.date >= startDate &&
            entry.date <= endDate &&
            (!typeFilter || entry.type === typeFilter)
        );

        filtered.forEach((entry, index) => {
            console.log(`${index + 1}: ${entry.amount} - ${entry.type.name} - ${entry.date}`);
        });

        return filtered;
    }
}

// Инициализация бюджета
const myBudget = new Budget();

// Создание валют и добавление курсов
const rub = myBudget.addValuta("RUB");
rub.addCourse(75.5, 77.5, "2024-11-01");
rub.addCourse(76.0, 78.0, "2024-11-10");

const usd = myBudget.addValuta("USD");
usd.addCourse(1.0, 1.0, "2024-11-01");
usd.addCourse(1.0, 1.0, "2024-11-10");

// Создание типов доходов и расходов
const salaryType = myBudget.addIncomeType("Лес");
const freelanceType = myBudget.addIncomeType("Ганк");
const foodType = myBudget.addExpenseType("Мом");
const transportType = myBudget.addExpenseType("Телепорт");

// Добавление доходов
const income1 = myBudget.addIncome(5000, salaryType, "2024-11-01", rub);
const income2 = myBudget.addIncome(2000, freelanceType, "2024-11-05", usd);
console.log("Доходы добавлены:");

// Вывод всех доходов
myBudget.incomes.forEach((income, index) => {
    console.log(`${index + 1}. ${income.amount} ${income.valuta.name} - ${income.type.name} - ${income.date}`);
});
// Добавление hfc[jljd
const outcome1 = myBudget.addExpense(200, foodType, "2024-11-01", rub);
const outcome2 = myBudget.addExpense(200, transportType, "2024-11-05", usd);
console.log("Расходы добавлены:");

// Вывод всех доходов
myBudget.expenses.forEach((expenses, index) => {
    console.log(`${index + 1}. ${expenses.amount} ${expenses.valuta.name} - ${expenses.type.name} - ${expenses.date}`);
});
// Расчет и вывод баланса за конкретный период
console.log("Баланс за период с 2024-11-01 по 2024-11-30:");
myBudget.calculateBalance("2024-11-01", "2024-11-30");