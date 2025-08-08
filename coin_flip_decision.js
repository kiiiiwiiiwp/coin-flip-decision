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
        listItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-index">#${decisionHistory.length - index}</span>
                <span class="history-date">${item.date}</span>
            </div>
            <div class="history-item-content">
                <p><strong>决策事项:</strong> ${item.decisionItem}</p>
                <p><strong>投掷次数:</strong> ${item.flipCount}</p>
                <p><strong>结果:</strong> ${item.winner}（正面 ${item.heads} 次, 反面 ${item.tails} 次）</p>
            </div>
        `;
        historyList.appendChild(listItem);
    });

    historyContainer.appendChild(historyList);
}

// 添加动画状态标志
let isAnimating = false;

document.getElementById('confirmBtn').addEventListener('click', function() {
    // 如果动画正在进行，则不执行
    if (isAnimating) return;

    const decisionItem = document.getElementById('decisionItem').value;
    const flipCount = parseInt(document.getElementById('flipCount').value);

    if (!decisionItem || isNaN(flipCount) || flipCount < 1) {
        alert('请输入有效的决策事项和投掷次数');
        return;
    }

    // 设置动画状态为进行中
    isAnimating = true;

    // 显示结果卡片
    const resultCard = document.getElementById('resultCard');
    resultCard.style.display = 'block';

    // 显示决策事项
    document.getElementById('itemDisplay').textContent = decisionItem;

    // 重置硬币状态
    const coin = document.getElementById('coin');
    coin.classList.remove('flipping', 'heads', 'tails', 'tie');

    // 隐藏具体次数
    document.getElementById('headsCount').textContent = '';
    document.getElementById('tailsCount').textContent = '';

    // 强制重绘
    void coin.offsetWidth;

    // 生成随机翻转圈数(7-12圈)和方向
    const randomFlips = 7 + Math.floor(Math.random() * 6); // 7-12圈
    const randomDirection = Math.random() < 0.5 ? 1 : -1; // 随机方向
    const flipAngle = randomFlips * 360 * randomDirection;

    // 应用随机翻转
    coin.style.transform = `rotateY(${flipAngle}deg)`;

    // 添加翻转类以触发动画
    coin.classList.add('flipping');

    // 执行抛硬币逻辑
    let heads = 0;
    for (let i = 0; i < flipCount; i++) {
        if (Math.random() < 0.5) {
            heads++;
        }
    }
    const tails = flipCount - heads;

    // 等待动画结束后显示结果
    setTimeout(() => {
        // 保存到历史记录
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // 确定获胜结果
        let winner;
        if (heads > tails) {
            winner = 'YES';
        } else if (tails > heads) {
            winner = 'NO';
        } else {
            winner = 'TIE';
        }

        decisionHistory.unshift({
            decisionItem,
            flipCount,
            heads,
            tails,
            winner,
            date: formattedDate
        });

        // 保存到本地存储
        localStorage.setItem('coinFlipHistory', JSON.stringify(decisionHistory));

        // 设置硬币最终状态和显示次数同时进行
        coin.classList.remove('flipping');

        if (heads > tails) {
            // 设置硬币最终朝向为正面（绿色，显示YES）
            coin.style.transform = 'rotateY(0deg)';
            coin.classList.add('heads');
        } else if (tails > heads) {
            // 设置硬币最终朝向为反面（红色，显示NO）
            coin.style.transform = 'rotateY(180deg)';
            coin.classList.add('tails');
        } else {
            // 平局时显示问号
            coin.style.transform = 'rotateY(0deg)';
            coin.classList.add('tie');
        }

        // 同时显示具体次数
        document.getElementById('headsCount').textContent = heads;
        document.getElementById('tailsCount').textContent = tails;

        // 更新历史记录显示
        displayHistory();

        // 清空输入框
        document.getElementById('decisionItem').value = '';
        document.getElementById('flipCount').value = '';

        // 重置动画状态
        setTimeout(() => {
            isAnimating = false;
        }, 500); // 额外延迟500ms确保动画完全结束
    }, 3000); // 等待动画结束（3秒）
});

// 清除历史记录功能
function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？')) {
        decisionHistory = [];
        localStorage.removeItem('coinFlipHistory');
        displayHistory();
    }
}

// 为清除历史记录按钮添加事件监听器
document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

// 页面加载时显示历史记录
window.addEventListener('load', displayHistory);