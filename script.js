// 情境資料庫定義
const scenarios = {
    hawk: [
        { node: "1. 政策與言論", item: "基準利率預期 / 官員態度", trend: "飆升 / 強硬鷹派", class: "trend-up", desc: "釋放緊縮訊號以壓制通膨預期，暗示未來將持續收緊流動性。" },
        { node: "2. 金融市場", item: "美債殖利率 & 美元指數", trend: "顯著上揚 (↑)", class: "trend-up", desc: "無風險利率攀升吸引全球資金回流美元資產，強力壓制美股估值。" },
        { node: "3. 信貸市場", item: "銀行放款及房貸利率", trend: "同步走高 (↑)", class: "trend-up", desc: "民眾房貸與企業融資成本大幅增加，整體實體信貸動能受創。" },
        { node: "4. 實體總需求", item: "企業資本支出 & 民間消費", trend: "受到顯著壓制 (↓)", class: "trend-down", desc: "借貸成本過高迫使企業縮減擴產規模、延緩招募；民眾減少貸款性消費。" },
        { node: "5. 物價結果", item: "核心 CPI / 通膨率走勢", trend: "逐步降溫回落 (↓)", class: "trend-down", desc: "終端需求降溫使得供需缺口收斂，廠商失去轉嫁成本能力，通膨率向2%目標靠攏。" }
    ],
    dove: [
        { node: "1. 政策與言論", item: "基準利率預期 / 官員態度", trend: "調降 / 溫和鴿派", class: "trend-down", desc: "強調經濟增長或就業市場風險，釋放放寬貨幣政策、增加流動性的訊號。" },
        { node: "2. 金融市場", item: "美債殖利率 & 美元指數", trend: "回落走低 (↓)", class: "trend-down", desc: "市場預期資金成本降低，殖利率下跌，美元走弱，資金流入股市及大宗商品市場。" },
        { node: "3. 信貸市場", item: "銀行放款及房貸利率", trend: "逐步下調 (↓)", class: "trend-down", desc: "市場流動性充裕，融資門檻及借貸利息下降，刺激借貸意願。" },
        { node: "4. 實體總需求", item: "企業資本支出 & 民間消費", trend: "顯著擴張 (↑)", class: "trend-up", desc: "廉價資金促進企業貸款進行擴產與招募，消費者也因借貸成本低而增加耐久財與房屋購買。" },
        { node: "5. 物價結果", item: "核心 CPI / 通膨率走勢", trend: "面臨上行壓力 (↑)", class: "trend-up", desc: "強勁的市場總需求推動商品與勞務價格全面走高，若缺乏供給端配合，極易引發高通膨。" }
    ]
};

// 切換情境函數
function switchScenario(type) {
    // 切換按鈕狀態
    document.getElementById('btn-hawk').classList.remove('active');
    document.getElementById('btn-dove').classList.remove('active');
    
    if (type === 'hawk') {
        document.getElementById('btn-hawk').classList.add('active');
    } else {
        document.getElementById('btn-dove').classList.add('active');
    }

    // 渲染表格內容
    const tbody = document.getElementById('simulator-tbody');
    tbody.innerHTML = '';

    scenarios[type].forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.node}</strong></td>
            <td>${row.item}</td>
            <td><span class="trend-badge ${row.class}">${row.trend}</span></td>
            <td>${row.desc}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 頁面加載完成後初始渲染並繪製圖表
document.addEventListener("DOMContentLoaded", () => {
    // 預設渲染鷹派場景
    switchScenario('hawk');

    // 歷史數據靜態對照模擬 (FED 利率 vs CPI 歷史循環模擬數據)
    const ctx = document.getElementById('fedChart').getContext('2d');
    
    // 檢查 Chart.js 是否成功加載
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T-24M', 'T-18M', 'T-12M', 'T-6M', 'T0 (政策頂峰)', 'T+6M', 'T+12M', 'T+18M', 'T+24M'],
                datasets: [
                    {
                        label: '聯邦基金利率 (Effective Federal Funds Rate, %)',
                        data: [1.0, 1.75, 3.25, 4.5, 5.25, 5.25, 4.75, 4.0, 3.5],
                        borderColor: '#2b6cb0',
                        backgroundColor: 'rgba(43, 108, 176, 0.1)',
                        borderWidth: 3,
                        yAxisID: 'y',
                        tension: 0.3
                    },
                    {
                        label: '美國核心 CPI 年增率 (Core CPI YoY, %)',
                        data: [3.2, 4.8, 5.9, 6.5, 5.5, 4.2, 3.1, 2.5, 2.1],
                        borderColor: '#e53e3e',
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        borderWidth: 3,
                        yAxisID: 'y1',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '聯準會基準利率 (%)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: '核心 CPI 年增率 (%)'
                        }
                    }
                }
            }
        });
    }
});
