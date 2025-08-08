// 历史记录数组
let decisionHistory = JSON.parse(localStorage.getItem('coinFlipHistory')) || [];

// 显示历史记录
function displayHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;

    historyContainer.innerHTML = '';
    if (decisionHistory.length === 0) {
        historyContainer.innerHTML = '<p>暂无历史记录</p>';
        return;
    }

    const historyList = document.createElement('ul');
    historyList.className = 'history-list';

    decisionHistory.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'history-item';
        listItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-index">#${decisionHistory.length - index}</span>
                <span class="history-date">${item.date}</span>
            </div>
            <div class="history-item-content">
                <p><strong>决策事项:</strong> ${item.decisionItem}</p>
                <p><strong>投掷次数:</strong> ${item.flipCount}</p>
                <p><strong>结果:</strong> 正面 ${item.heads} 次, 反面 ${item.tails} 次</p>
            </div>
        `;
        historyList.appendChild(listItem);
    });

    historyContainer.appendChild(historyList);
}

document.getElementById('confirmBtn').addEventListener('click', function() {
    const decisionItem = document.getElementById('decisionItem').value;
    const flipCount = parseInt(document.getElementById('flipCount').value);

    if (!decisionItem || isNaN(flipCount) || flipCount < 1) {
        alert('请输入有效的决策事项和投掷次数');
        return;
    }

    let heads = 0;
    for (let i = 0; i < flipCount; i++) {
        if (Math.random() < 0.5) {
            heads++;
        }
    }
    const tails = flipCount - heads;

    // 保存到历史记录
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    decisionHistory.unshift({
        decisionItem,
        flipCount,
        heads,
        tails,
        date: formattedDate
    });

    // 保存到本地存储
    localStorage.setItem('coinFlipHistory', JSON.stringify(decisionHistory));

    // 显示决策事项
    document.getElementById('itemDisplay').textContent = decisionItem;

    // 显示多数结果
    const majorityElement = document.getElementById('majorityResult');
    if (heads > tails) {
        majorityElement.textContent = 'YES';
        majorityElement.className = 'yes';
    } else if (tails > heads) {
        majorityElement.textContent = 'NO';
        majorityElement.className = 'no';
    } else {
        majorityElement.textContent = 'TIE';
        majorityElement.className = 'tie';
    }

    // 显示具体次数
    document.getElementById('headsCount').textContent = heads;
    document.getElementById('tailsCount').textContent = tails;

    // 显示结果卡片
    document.getElementById('resultCard').style.display = 'block';

    // 更新历史记录显示
    displayHistory();

    // 清空输入框
    document.getElementById('decisionItem').value = '';
    document.getElementById('flipCount').value = '';
});

// 页面加载时显示历史记录
window.addEventListener('load', displayHistory);