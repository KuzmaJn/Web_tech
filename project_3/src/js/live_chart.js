$(document).ready(function() {
    const ctx = $('#liveChart')[0].getContext('2d');
    const chartData = {
    labels: [],
    datasets: [
        {
            label: 'Zašumený sínus',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            hidden: false
        },
        {
            label: 'Zašumený kosínus',
            data: [],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            hidden: false
        }
    ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'X' } },
            y: { title: { display: true, text: 'Y' } },
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                zoom: {
                    wheel: {
                        enabled: false,
                    },
                    mode: 'xy',
                }

            }
        }
    };
    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: options
    });

    let amplitude = 1;

    // Initialize EventSource
    const eventSource = new EventSource('https://old.iolab.sk/evaluation/sse/sse.php');

    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data) {
            chartData.labels.push(data.x);
            chartData.datasets[0].data.push(parseFloat(data.y1) * amplitude);
            chartData.datasets[1].data.push(parseFloat(data.y2) * amplitude);
            myChart.update();
        } else {
        console.error('Invalid response format:', data);
        }
    };

    eventSource.onerror = function(event) {
        console.error('Error:', event);
    };

    $('#amplitude-meter').on('input', function() {
        amplitude = parseFloat(this.slider.value);
        $('#amplitude-meter').val(amplitude);
    });

    $('#endButton').on('click', function() {
        options.plugins.zoom.zoom.wheel.enabled = true;
        eventSource.close();
    });
});