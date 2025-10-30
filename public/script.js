let currentDate = new Date();

// 임시 지출 데이터 
let expenses = {
    
};

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const calendarGrid = document.getElementById('calendarGrid');

    monthYearDisplay.textContent = `${year}년 ${month + 1}월`;
    document.getElementById('summaryMonth').textContent = `${year}년 ${month + 1}월`;

    while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('date-cell', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDate; day++) {
        const dateCell = document.createElement('div');
        dateCell.classList.add('date-cell');
        dateCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dateCell.innerHTML = `<span class="date-cell-number">${day}</span>`;

        const dateKey = dateCell.dataset.date;
        const dailyExpenses = expenses[dateKey];
        if (dailyExpenses && dailyExpenses.length > 0) {
            const total = dailyExpenses.reduce((sum, item) => sum + item.amount, 0);
            const expenseSpan = document.createElement('span');
            expenseSpan.classList.add('date-expense');
            expenseSpan.textContent = `₩${total.toLocaleString()}`;
            dateCell.appendChild(expenseSpan);
        }

        dateCell.addEventListener('click', (e) => {
            handleDateClick(e.currentTarget);
        });

        calendarGrid.appendChild(dateCell);
    }

    document.getElementById('selectedDateOutput').innerHTML = '';
    document.querySelector('.click-info').style.display = 'block';
    document.getElementById('expenseInputForm').style.display = 'none';

    updateMonthlySummary(year, month + 1);
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

let selectedDateElement = null;
function handleDateClick(cell) {
    if (cell.classList.contains('empty')) return;

    if (selectedDateElement) {
        selectedDateElement.classList.remove('selected');
    }
    
    selectedDateElement = cell;
    cell.classList.add('selected');

    const dateKey = cell.dataset.date;
    const dailyExpenses = expenses[dateKey] || [];
    const outputDiv = document.getElementById('selectedDateOutput');
    
    document.querySelector('.click-info').style.display = 'none';

    if (dailyExpenses.length > 0) {
        outputDiv.innerHTML = `<h4>${dateKey} 지출 내역</h4>`;
        dailyExpenses.forEach((item, index) => {
            const expenseP = document.createElement('p');
            expenseP.innerHTML = `${item.tag} / ${item.amount.toLocaleString()} 원 <br> <span style="font-size:0.8em; color:#999;">${item.memo || '메모 없음'}</span>`;
            
            expenseP.addEventListener('click', () => {
                editExpense(dateKey, index);
            });
            outputDiv.appendChild(expenseP);
        });
    } else {
        outputDiv.innerHTML = `<p style="text-align:center; color:#999;">입력된 지출 내역이 없습니다.</p>`;
    }

    document.getElementById('expenseInputForm').style.display = 'block';
}

function showExpenseEditor(dateKey = selectedDateElement ? selectedDateElement.dataset.date : null, index = -1) {
    if (!dateKey) {
        alert('날짜를 먼저 선택해 주세요.');
        return;
    }
    
    const editor = document.getElementById('expenseEditor');
    editor.style.display = 'block';
    
    document.getElementById('expenseTag').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseMemo').value = '';
    
    if (index !== -1) {
        const item = expenses[dateKey][index];
        document.getElementById('expenseTag').value = item.tag;
        document.getElementById('expenseAmount').value = item.amount;
        document.getElementById('expenseMemo').value = item.memo;
        editor.dataset.editIndex = index;
    } else {
        delete editor.dataset.editIndex;
    }
    editor.dataset.dateKey = dateKey;
}

function hideExpenseEditor() {
    document.getElementById('expenseEditor').style.display = 'none';
}

function saveExpense() {
    const editor = document.getElementById('expenseEditor');
    const dateKey = editor.dataset.dateKey;
    const editIndex = editor.dataset.editIndex;
    
    const tag = document.getElementById('expenseTag').value;
    const amount = parseInt(document.getElementById('expenseAmount').value, 10);
    const memo = document.getElementById('expenseMemo').value;

    if (!dateKey || !tag || isNaN(amount) || amount <= 0) {
        alert('태그와 유효한 금액을 입력해 주세요.');
        return;
    }

    const newExpense = { tag, amount, memo };

    if (!expenses[dateKey]) {
        expenses[dateKey] = [];
    }
    
    if (editIndex !== undefined) {
        expenses[dateKey][parseInt(editIndex, 10)] = newExpense;
    } else {
        expenses[dateKey].push(newExpense);
    }

    hideExpenseEditor();
    
    handleDateClick(selectedDateElement);
    renderCalendar(currentDate);
}

function editExpense(dateKey, index) {
    showExpenseEditor(dateKey, index);
}

function updateMonthlySummary(year, month) {
    const tagTotals = {};
    let grandTotal = 0;
    const monthKeyPrefix = `${year}-${String(month).padStart(2, '0')}`;
    
    for (const dateKey in expenses) {
        if (dateKey.startsWith(monthKeyPrefix)) {
            expenses[dateKey].forEach(item => {
                if (tagTotals[item.tag]) {
                    tagTotals[item.tag] += item.amount;
                } else {
                    tagTotals[item.tag] = item.amount;
                }
                grandTotal += item.amount;
            });
        }
    }

    const tagSummaryList = document.getElementById('tagSummaryList');
    tagSummaryList.innerHTML = '';

    for (const tag in tagTotals) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${tag}</span> <span>${tagTotals[tag].toLocaleString()} 원</span>`;
        tagSummaryList.appendChild(li);
    }
    
    document.getElementById('totalAmount').textContent = grandTotal.toLocaleString() + ' 원';
}

document.querySelector('.recommend-btn').addEventListener('click', () => {
    const recommendationsDiv = document.getElementById('cardRecommendations');
    recommendationsDiv.innerHTML = '';

    const mockRecommendations = [
        { rank: 1, name: 'Best-Saver 카드', benefits: '식비 10%, 교통 5% 캐시백', maxBenefit: 75000 },
        { rank: 2, name: 'Everyday 카드', benefits: '온라인 쇼핑 7% 할인', maxBenefit: 50000 },
        { rank: 3, name: 'Travel-Pass 카드', benefits: '해외 결제 수수료 면제', maxBenefit: 30000 },
    ];

    mockRecommendations.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('card-item');
        cardItem.innerHTML = `
            <div class="card-image-box">${card.rank}위</div>
            <div class="card-details">
                <h4>${card.name}</h4>
                <p>혜택: ${card.benefits}</p>
                <p><strong>예상 혜택 금액: ${card.maxBenefit.toLocaleString()} 원</strong></p>
            </div>
        `;
        recommendationsDiv.appendChild(cardItem);
    });
});

window.onload = () => {
    renderCalendar(currentDate);
};
