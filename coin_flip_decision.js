// 历史记录数组
let decisionHistory = JSON.parse(localStorage.getItem('coinFlipHistory')) || [];

// 显示历史记录
function displayHistory() {
    console.log('历史记录数据:', decisionHistory);
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
                <p><strong>问题:</strong> ${item.decisionItem}</p>
                <p><strong>次数:</strong> ${item.flipCount}</p>
                <p><strong>结果:</strong> ${item.winner}（YES ${item.heads} 次, NO ${item.tails} 次）</p>
            </div>
        `;
        historyList.appendChild(listItem);
    });

    historyContainer.appendChild(historyList);
}

// 添加动画状态标志
let isAnimating = false;

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 检查确认按钮元素是否存在
    const confirmBtn = document.getElementById('confirmBtn');
    console.log('确认按钮元素:', confirmBtn);
    if (confirmBtn) {
        console.log('确认按钮事件监听器已绑定');
        // 添加点击事件监听器
        confirmBtn.addEventListener('click', function() {
            console.log('确认按钮被点击');
            handleConfirmClick();
        });
    } else {
        console.log('未找到确认按钮元素');
    }
});

// 处理确认按钮点击事件的函数
function handleConfirmClick() {
    console.log('isAnimating:', isAnimating);
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

    // 立即设置日期
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    document.getElementById('resultDate').textContent = formattedDate;

    const coin = document.getElementById('coin');
    // 完全重置硬币状态
    // 1. 移除过渡动画
    coin.style.transition = 'none';
    // 2. 设置初始位置
    coin.style.transform = 'rotateY(0deg)';
    // 3. 强制重绘
    coin.offsetHeight;
    // 4. 恢复过渡动画
    coin.style.transition = '';
    // 5. 移除所有状态类
    coin.classList.remove('flipping', 'heads', 'tails', 'tie');
    document.getElementById('headsCount').textContent = '';
    document.getElementById('tailsCount').textContent = '';

    // 随机圈数用于动画 (增加圈数范围以确保足够的翻转效果)
    const randomFlips = 10 + Math.floor(Math.random() * 8); // 10-17圈

    // 抛硬币逻辑（先算结果）
    let heads = 0;
    for (let i = 0; i < flipCount; i++) {
        if (Math.random() < 0.5) heads++;
    }
    const tails = flipCount - heads;

    let winner = 'TIE';
    if (heads > tails) winner = 'YES';
    else if (tails > heads) winner = 'NO';

    // 已在前面设置randomFlips变量
    let finalAngle = randomFlips * 360;

    if (winner === 'NO') finalAngle += 180;

    // 应用动画（与结果同步）
    coin.style.transform = `rotateY(${finalAngle}deg)`;
    coin.classList.add('flipping');

    // 动画结束后设置最终类名和文字结果
    setTimeout(() => {
        const now = new Date();
        // 历史记录包含时分
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

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

        isAnimating = false;
    }, 3000);
}

// 确认按钮事件监听器已在DOMContentLoaded中绑定

// 清除历史记录功能
function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？')) {
        decisionHistory = [];
        localStorage.removeItem('coinFlipHistory');
        displayHistory();
        
        // 隐藏结果卡片
        const resultCard = document.getElementById('resultCard');
        if (resultCard) {
            resultCard.style.display = 'none';
        }
    }
}

document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
window.addEventListener('load', displayHistory);