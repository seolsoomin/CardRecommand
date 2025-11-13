let currentDate = new Date();

let expenses = {
    
};

const predefinedTags = [
    '구독',
    '대중교통',
    '대형마트',
    '레저/스포츠',
    '쇼핑',
    '여행/숙박',
    '영화/공연',
    '외식/배달',
    '주유',
    '카페/베이커리',
    '통신/렌탈',
    '편의점'
];

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
    currentDate.setDate(1); 
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setDate(1); 
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
            const expenseDiv = document.createElement('div');
            expenseDiv.classList.add('expense-item');
            expenseDiv.innerHTML = `
                <p>
                    ${item.tag} / ${item.amount.toLocaleString()} 원 
                    <br> 
                    <span style="font-size:0.8em; color:#999;">${item.memo || '메모 없음'}</span>
                </p>
                <div class="expense-actions">
                    <button class="edit-btn" data-index="${index}">수정</button>
                    <button class="delete-btn" data-index="${index}">삭제</button>
                </div>
            `;
            
            expenseDiv.querySelector('.edit-btn').addEventListener('click', () => {
                editExpense(dateKey, index);
            });
            
            expenseDiv.querySelector('.delete-btn').addEventListener('click', () => {
                deleteExpense(dateKey, index);
            });

            outputDiv.appendChild(expenseDiv);
        });
    } else {
        outputDiv.innerHTML = `<p style="text-align:center; color:#999;">입력된 지출 내역이 없습니다.</p>`;
    }

    document.getElementById('expenseInputForm').style.display = 'block';
}

function renderTagSelectOptions() {
    const selectElement = document.getElementById('expenseTag');
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }

    predefinedTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        selectElement.appendChild(option);
    });
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

async function saveExpense() {
    const editor = document.getElementById('expenseEditor');
    const dateKey = editor.dataset.dateKey;
    const editIndex = editor.dataset.editIndex;
    
    const tag = document.getElementById('expenseTag').value; 
    const amount = parseInt(document.getElementById('expenseAmount').value, 10);
    const memo = document.getElementById('expenseMemo').value;

    if (!dateKey || !tag || isNaN(amount) || amount <= 0) {
        alert('유효한 태그와 금액을 선택/입력해 주세요.');
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

    if(expenses[dateKey][parseInt(editIndex, 10)]){
        fetch("http://localhost:3000/api/update", {
            method : "PUT",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({
                spendDate : dateKey,
                tag : tag,
                howMuch : amount,
                memo : memo,
                o_Tag : expenses[dateKey][parseInt(editIndex, 10)].tag,
                o_howMuch : expenses[dateKey][parseInt(editIndex, 10)].amount,
                o_memo : expenses[dateKey][parseInt(editIndex, 10)].memo
            })
        })
        .then((response) => {
            if(!response.ok){
                throw new Error("서버 오류 : " + response.status);
            }

            return response.json();
        })
        .then((data) => console.log(data))
        .catch(error => console.log(`에러 발생 : ${error}`));
    }else{
        fetch("http://localhost:3000/api/save", { //backend로 데이터 넘겨줌.
        method : "POST", //method ==> POST
        headers : { //헤더 설정
            "Content-type" : "application/json"
        },
        body : JSON.stringify({ //body 설정
            spendDate : dateKey,
            tag : tag,
            howMuch : amount,
            memo : memo
        }),
    })
    .then((response) => { //promise
        if(!response.ok){ //만약 성공하지 않았을 경우 처리
            throw new Error("서버 오류 : " + response.status);
        }

        return response.json(); //아닌 경우 성공한거 보여줌
    })
    .then((data) => console.log(data)) //넘어간 데이터 출력.
    .catch((error) => console.log(`에러 발생 : ${error}`)); //에러 발생을 알리고 어떤 오류 발생했는지 알려줌
    }   

}

function editExpense(dateKey, index) {
    showExpenseEditor(dateKey, index);
}

function deleteExpense(dateKey, index) {

    const deleteItem = expenses[dateKey][index];

    if (confirm('이 지출 항목을 정말 삭제하시겠습니까?')) {
        expenses[dateKey].splice(index, 1);

        if (expenses[dateKey].length === 0) {
            delete expenses[dateKey];
        }

        handleDateClick(selectedDateElement);
        renderCalendar(currentDate);
    }

    fetch('http://localhost:3000/api/delete', { //fetch, 데이터 넘겨 줄 링크 
        method : "PUT", //메소드 PUT
        headers : { //header 설정
            "Content-type" : "application/json"
        },
        body : JSON.stringify({ //body 내용 지정, json
            spendDate : dateKey,
            tag : deleteItem.tag,
            howMuch : deleteItem.amount,
            memo : deleteItem.memo
        })
    })
    .then((response) => { //promise
        if(!response.ok){ //만약 성공하지 않았을 경우 처리
            throw new Error("서버 오류 : " + response.status);
        }

        return response.json(); //아닌 경우 성공한거 보여줌
    })
    .then((data) => console.log(data)) //응답 출력?
    .catch((error) => console.log(`에러 발생 : ${error}`)); //에러 발생을 알리고 어떤 오류가 발생했는지 알려줌
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
    renderTagSelectOptions();
};
