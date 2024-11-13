let barChart;
function loadXMLData(callback) {
    $.ajax({
        url: '../../assets/z03.xml', // Path to your XML file
        method: 'GET',
        dataType: 'xml',
        success: callback,
        error: (error) => console.error('Error loading XML:', error),
    });
}

function parseXML(xml) {
    const data = [];
    $(xml).find('zaznam').each(function () {
        const year = $(this).find('rok').text();
        const grades = {
            A: parseInt($(this).find('A').text()),
            B: parseInt($(this).find('B').text()),
            C: parseInt($(this).find('C').text()),
            D: parseInt($(this).find('D').text()),
            E: parseInt($(this).find('E').text()),
            FX: parseInt($(this).find('FX').text()),
            FN: parseInt($(this).find('FN').text())
        };
        data.push({ year, grades });
    });
    return data;
}

function getChartType() {
    return window.innerWidth < 678 ? 'y' : 'x';
}

function updateChartType() {
    const newChartType = getChartType();
    if (newChartType) {
        if (newChartType === 'x') {
            barChart.config.options.scales.y = {beginAtZero: true, title: {display: true, text: 'Počet študentov'}};
            barChart.config.options.scales.x = {title: {display: true, text: 'Akademickcký rok'}}
            barChart.canvas.parentNode.style.height = '90vh';
            barChart.canvas.parentNode.style.width = '90vw';
        } else {
            barChart.config.options.scales.x = {beginAtZero: true, title: {display: true, text: 'Počet študentov'}};
            barChart.config.options.scales.y = {title: {display: true, text: 'Akademickcký rok'}}
            barChart.canvas.parentNode.style.height = '190vh';
            barChart.canvas.parentNode.style.width = '90vw';
        }
        barChart.config.options.indexAxis = newChartType;


        barChart.update();
    }
}

function createBarChart(data) {
    const labels = data.map(item => item.year);
    const gradeA = data.map(item => item.grades.A);
    const gradeB = data.map(item => item.grades.B);
    const gradeC = data.map(item => item.grades.C);
    const gradeD = data.map(item => item.grades.D);
    const gradeE = data.map(item => item.grades.E);
    const gradeFX = data.map(item => item.grades.FX);
    const gradeFN = data.map(item => item.grades.FN);

    const ctx = document.getElementById('barChart').getContext('2d');
    const chartType = getChartType();
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {label: 'A', data: gradeA, backgroundColor: '#4bc0c0'},
                {label: 'B', data: gradeB, backgroundColor: '#36a2eb'},
                {label: 'C', data: gradeC, backgroundColor: '#ffce56'},
                {label: 'D', data: gradeD, backgroundColor: '#ff6384'},
                {label: 'E', data: gradeE, backgroundColor: '#9966ff'},
                {label: 'FX', data: gradeFX, backgroundColor: '#c9cbcf'},
                {label: 'FN', data: gradeFN, backgroundColor: '#ff9f40'}
            ]
        },
        options: {
            indexAxis: chartType,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {beginAtZero: true, title: {display: true, text: 'Počet študentov'}},
                x: {title: {display: true, text: 'Akademickcký rok'}}
            },
            plugins: {
                legend: {position: 'top'},
                title: {display: true, text: 'Výsledky študentov medzi rokmi 2016/17 až 2023/24'}
            }
        }
    });
    window.addEventListener('resize', () => {
        const newChartType = getChartType();
        if (barChart.config.options.indexAxis !== newChartType) {
            barChart.config.options.indexAxis = newChartType;
            barChart.update();
        }
    });
}

function createPieCharts(data) {
    data.forEach((item, index) => {
        const ctx = document.getElementById(`pieChart${index}`).getContext('2d');
        const grades = Object.values(item.grades);
        const labels = ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'];
        const colors = ['#4bc0c0', '#36a2eb', '#ffce56', '#ff6384', '#9966ff', '#c9cbcf', '#ff9f40'];

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: grades,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: `Akademický rok ${item.year}` }
                }
            }
        });
    });
}

function createGradeAChart(data) {
    const labels = data.map(item => item.year);
    const gradeA = data.map(item => item.grades.A);

    const ctx = document.getElementById('gradeAChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // Using a line chart for better visualization over time
        data: {
            labels,
            datasets: [
                {
                    label: 'Grade A',
                    data: gradeA,
                    backgroundColor: '#4bc0c0',
                    borderColor: '#4bc0c0',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Počet študentov' } },
                x: { title: { display: true, text: 'Akademický rok' } }
            },
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Počet študentov, ktorí získali "A" v priebehu rokov' }
            }
        }
    });
}

$(document).ready(() => {
    console.log('doc ready')
    loadXMLData((xml) => {
        const parsedData = parseXML(xml);
        createBarChart(parsedData);
        updateChartType();
        createPieCharts(parsedData);
        createGradeAChart(parsedData);
    });
    window.addEventListener('resize', updateChartType);
});