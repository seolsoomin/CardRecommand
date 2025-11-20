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
    '편의점',
    '기타'
];

const CALENDAR_SAVE_URL = '/calendar/save'; 
let googleIdToken = localStorage.getItem('googleIdToken'); 

function handleCredentialResponse(response) {
    const id_token = response.credential;
    console.log("Google ID Token:", id_token);
    
    googleIdToken = id_token;
    localStorage.setItem('googleIdToken', id_token);

    alert("Google 로그인 성공! 메인 페이지로 이동합니다.");
    window.location.href = 'index.html'; 
}

async function saveToGoogleCalendar(expenseData) {
    if (!googleIdToken) {
        alert("Google 캘린더에 저장하려면 먼저 로그인해야 합니다. 로그인 페이지로 이동합니다.");
        window.location.href = 'login.html';
        return false;
    }

    try {
        const response = await fetch(CALENDAR_SAVE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${googleIdToken}` 
            },
            body: JSON.stringify(expenseData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log("캘린더 저장 성공:", result.message);
            return true;
        } else {
            console.error("캘린더 저장 실패:", result.message);
            alert(`캘린더 저장 실패: ${result.message}\n로그인 세션이 만료되었을 수 있습니다.`);
            localStorage.removeItem('googleIdToken');
            googleIdToken = null;
            return false;
        }

    } catch (error) {
        console.error("캘린더 저장 중 오류 발생:", error);
        alert("네트워크 또는 서버 오류로 캘린더 저장을 실패했습니다.");
        return false;
    }
}

function updateTagsDropdown() {
    const tagSelect = document.getElementById('expenseTag');
    tagSelect.innerHTML = '<option value="" disabled selected>태그를 선택하세요</option>';
    predefinedTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}

async function saveExpense() {
    const selectedDate = document.querySelector('.date-cell.selected')?.dataset.fullDate;
    const tag = document.getElementById('expenseTag').value;
    const amount = parseInt(document.getElementById('expenseAmount').value);
    const memo = document.getElementById('expenseMemo').value;

    if (!selectedDate || !tag || isNaN(amount) || amount <= 0) {
        alert('날짜, 태그, 금액을 정확히 입력해주세요.');
        return;
    }
    
    const calendarData = {
        summary: `[지출] ${tag}: ${amount.toLocaleString()}원`,
        description: `메모: ${memo || '없음'}\n[신한카드 추천 서비스] 앱에서 생성됨`,
        date: selectedDate,
        amount: amount,
        tag: tag
    };
    
    const calendarSaved = await saveToGoogleCalendar(calendarData);
    
    if (calendarSaved) {
        let dbSaved = false;
        try {
            const dbResponse = await fetch('/save', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    spendDate: selectedDate, 
                    tag: tag, 
                    howMuch: amount, 
                    memo: memo 
                })
            });

            const dbResult = await dbResponse.json();
            if (dbResponse.ok && dbResult.success) {
                console.log("DB 저장 성공");
                dbSaved = true;
            } else {
                console.error("DB 저장 실패:", dbResult.message);
                alert("DB 저장에는 실패했지만 Google 캘린더에는 저장되었습니다."); 
            }
        } catch (dbError) {
            console.error("DB 저장 중 오류 발생:", dbError);
            alert("DB 저장 중 오류 발생");
        }
        
        const expenseId = `${selectedDate}_${Date.now()}`;
        const newExpense = { tag, amount, memo, id: expenseId, date: selectedDate };
        if (!expenses[selectedDate]) {
            expenses[selectedDate] = [];
        }

        // console.log(expenseId);

        expenses[selectedDate].push(newExpense);

        hideExpenseEditor();
        updateExpenseList(selectedDate);
        updateSummary();
        renderCalendar(currentDate);
        
        if (dbSaved) {
            alert("지출이 성공적으로 저장되고 Google 캘린더에 추가되었습니다.");
        }
        
    } else {
        alert("Google 캘린더 저장 실패로 인해 DB 저장 및 로컬 저장을 취소합니다.");
    }
}


async function deleteExpense(date, id) {
    const expenseIndex = expenses[date].findIndex(e => e.id === id);
    let deleted = false;

    if (expenseIndex > -1) {
        const expenseToDelete = expenses[date][expenseIndex];
                
        expenses[date].splice(expenseIndex, 1);
        updateExpenseList(date);
        updateSummary();

        try{
            const response = await fetch("/delete", { //front에서 데이터 넘겨줌. 
                method : 'PUT', //메소드 DELETE를 사용하는게 옳으나, body를 넘기면 오류가 발생하여 PUT 사용
                headers: { 'Content-Type': 'application/json' },

                body : JSON.stringify ({ //req.body
                    spendDate : date,
                    tag : expenseToDelete.tag,
                    howMuch : expenseToDelete.amount,
                    memo : expenseToDelete.memo
                })
            });

            const result = await response.json();

            if(response.ok && result.success){
                console.log(`데이터 삭제 성공`);
                deleted = true;

            } else {
                console.error(`삭제 실패 : `, result.message);
                alert('삭제에 실패했습니다.');
            }
        }
        catch (err) {
            console.error(`데이터 삭제 중 오류 발생 : `, err);
            alert(`삭제 중 오류 발생`);
        }
    }

}

function updateSummary() {
    const tagTotals = {};
    let grandTotal = 0;

    for (const date in expenses) {
        expenses[date].forEach(expense => {
            const tag = expense.tag;
            const amount = expense.amount;
            
            tagTotals[tag] = (tagTotals[tag] || 0) + amount;
            grandTotal += amount;
        });
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

function updateExpenseList(date) {
    const outputDiv = document.getElementById('selectedDateOutput');
    const expensesForDate = expenses[date] || [];
    
    if (expensesForDate.length === 0) {
        outputDiv.innerHTML = `<p>선택된 날짜의 지출 내역이 없습니다.</p>`;
    } else {
        outputDiv.innerHTML = `<h4>${date} 지출 내역</h4>`;
        
        let total = 0;
        expensesForDate.forEach(expense => {
            total += expense.amount;
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <span class="tag">${expense.tag}</span>
                <span class="amount">${expense.amount.toLocaleString()} 원</span>
                <span class="memo">${expense.memo}</span>
                <button class="delete-btn" onclick="deleteExpense('${date}', '${expense.id}')">X</button>
            `;
            outputDiv.appendChild(expenseItem);
        });
        
        const totalP = document.createElement('p');
        totalP.innerHTML = `<strong>합계: ${total.toLocaleString()} 원</strong>`;
        outputDiv.appendChild(totalP);
    }
    
    document.getElementById('expenseInputForm').style.display = 'block';
}

function showExpenseEditor() {
    document.getElementById('expenseEditor').style.display = 'block';
}

function hideExpenseEditor() {
    document.getElementById('expenseEditor').style.display = 'none';
    document.getElementById('expenseTag').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseMemo').value = '';
}

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
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        dateCell.classList.add('date-cell');
        dateCell.dataset.fullDate = fullDate;
        dateCell.innerHTML = `<span>${day}</span>`;
        
        if (expenses[fullDate] && expenses[fullDate].length > 0) {
            const totalAmount = expenses[fullDate].reduce((sum, e) => sum + e.amount, 0);
            const expenseDot = document.createElement('div');
            expenseDot.classList.add('expense-dot');
            expenseDot.textContent = `${(totalAmount/1000).toFixed(0)}k`;
            dateCell.appendChild(expenseDot);
        }

        dateCell.addEventListener('click', () => {
            document.querySelectorAll('.date-cell').forEach(cell => {
                cell.classList.remove('selected');
            });
            dateCell.classList.add('selected');
            updateExpenseList(fullDate);
        });

        calendarGrid.appendChild(dateCell);
    }
}

function prevMonth() {
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    updateSummary();
}

function nextMonth() {
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    updateSummary();
}

document.getElementById('prevMonth').addEventListener('click', prevMonth);
document.getElementById('nextMonth').addEventListener('click', nextMonth);

async function loadInitialData() {
    try {
        const response = await fetch('/lookup');
        const data = await response.json();
        
        if (data.success) {
            data.spends.forEach(item => {
                const date = item.spendDate;
                const expense = {
                    tag: item.tag,
                    amount: item.howMuch,
                    memo: item.memo,
                    id: `${date}_${Math.random().toString(36).substring(2, 9)}`, // 임시 ID 생성
                    date: date
                };
                if (!expenses[date]) {
                    expenses[date] = [];
                }
                expenses[date].push(expense);
            });
            console.log("DB 데이터 로드 성공");
        }
    } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
    }

    updateTagsDropdown();
    renderCalendar(currentDate);
    updateSummary();
}

loadInitialData();

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
