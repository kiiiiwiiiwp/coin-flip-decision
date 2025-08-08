// 历史记录数组
let decisionHistory = JSON.parse(localStorage.getItem('coinFlipHistory')) || [];

// 显示历史记录
function displayHistory() {
    const historyContainer = document.getElementById('historyContainer');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (!historyContainer || !clearHistoryBtn) return;

    historyContainer.innerHTML = '';
    if (decisionHistory.length === 0) {
        historyContainer.innerHTML = '<p>暂无历史记录</p>';
        clearHistoryBtn.style.display = 'none';
        return;
    }

    clearHistoryBtn.style.display = 'block';

    const historyList = document.createElement('ul');
    historyList.className = 'history-list';

    decisionHistory.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'history-item';
        listItem.innerHTML = \`
            <div class="history-item-header">
                <span class="history-index">#\${decisionHistory.length - index}</span>
                <span class="history-date">\${item.date}</span>
            </div>
            <div class="history-item-content">
                <p><strong>决策事项:</strong> \${item.decisionItem}</p>
                <p><strong>投掷次数:</strong> \${item.flipCount}</p>
                <p><strong>结果:</strong> \${item.winner}（正面 \${item.heads} 次, 反面 \${item.tails} 次）</p>
            </div>
        \`;
        historyList.appendChild(listItem);
    });

    historyContainer.appendChild(historyList);
}

// 添加动画状态标志
let isAnimating = false;

document.getElementById('confirmBtn').addEventListener('click', function() {
    if (isAnimating) return;

    const decisionItem = document.getElementById('decisionItem').value;
    const flipCount = parseInt(document.getElementById('flipCount').value);

    if (!decisionItem || isNaN(flipCount) || flipCount < 1) {
        alert('请输入有效的决策事项和投掷次数');
        return;
    }

    isAnimating = true;

    const resultCard = document.getElementById('resultCard');
    resultCard.style.display = 'block';
    document.getElementById('itemDisplay').textContent = decisionItem;

    const coin = document.getElementById('coin');
    coin.classList.remove('flipping', 'heads', 'tails', 'tie');
    document.getElementById('headsCount').textContent = '';
    document.getElementById('tailsCount').textContent = '';
    void coin.offsetWidth; // 强制重绘

    // 抛硬币逻辑（先算结果）
    let heads = 0;
    for (let i = 0; i < flipCount; i++) {
        if (Math.random() < 0.5) heads++;
    }
    const tails = flipCount - heads;

    let winner = 'TIE';
    if (heads > tails) winner = 'YES';
    else if (tails > heads) winner = 'NO';

    // 随机圈数用于动画
    const randomFlips = 7 + Math.floor(Math.random() * 6); // 7-12圈
    let finalAngle = randomFlips * 360;

    if (winner === 'NO') finalAngle += 180;

    // 应用动画（与结果同步）
    coin.style.transform = \`rotateY(\${finalAngle}deg)\`;
    coin.classList.add('flipping');

    // 动画结束后设置最终类名和文字结果
    setTimeout(() => {
        const now = new Date();
        const formattedDate = \`\${now.getFullYear()}-\${(now.getMonth() + 1).toString().padStart(2, '0')}-\${now.getDate().toString().padStart(2, '0')} \${now.getHours().toString().padStart(2, '0')}:\${now.getMinutes().toString().padStart(2, '0')}\`;

        decisionHistory.unshift({
            decisionItem,
            flipCount,
            heads,
            tails,
            winner,
            date: formattedDate
        });

        localStorage.setItem('coinFlipHistory', JSON.stringify(decisionHistory));

        coin.classList.remove('flipping');

        if (winner === 'YES') coin.classList.add('heads');
        else if (winner === 'NO') coin.classList.add('tails');
        else coin.classList.add('tie');

        document.getElementById('headsCount').textContent = heads;
        document.getElementById('tailsCount').textContent = tails;

        displayHistory();

        document.getElementById('decisionItem').value = '';
        document.getElementById('flipCount').value = '';

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }, 3000);
});

// 清除历史记录功能
function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？')) {
        decisionHistory = [];
        localStorage.removeItem('coinFlipHistory');
        displayHistory();
    }
}

document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
window.addEventListener('load', displayHistory);