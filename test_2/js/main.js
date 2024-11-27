const url = "assets/fables.json";
const getDataButton = document.getElementById('get_data');
const transcribeButton = document.getElementById('transcribe');
const stopButton = document.getElementById('stop');
const fableTitle = document.getElementById('title');
const fableAuthor = document.getElementById('author');
const fableParagraph = document.getElementById('fable');
const transcribedParagraph = document.getElementById('tr_fable');
const moralHeader = document.getElementById('moral');
let intervalId = null;
let words = [];
let index = 0; // Current word index

function startTranscription(moral) {
    if (words.length === 0) {
        words = fableParagraph.textContent.split(' ');
        index = 0;
        transcribedParagraph.textContent = '';
    }

    intervalId = setInterval(() => {
        if (index < words.length) {
            transcribedParagraph.textContent += (index === 0 ? ' ' : ' ') + words[index];

            words.splice(index, 1);
            fableParagraph.textContent = words.join(' ');
        }

        if (words.length === 0) {
            clearInterval(intervalId);
            moralHeader.textContent = moral;
        }
    }, 500);
}

// Function to stop transcription
function stopTranscription() {
    clearInterval(intervalId); // Stop the interval
    intervalId = null; // Clear the interval ID
}

// Event listeners

function getRandomObject(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        const array = data.fables;
        const randomFable = getRandomObject(array)
        getDataButton.addEventListener('click', function () {
            fableTitle.textContent = randomFable.title;
            fableAuthor.textContent = randomFable.author;
            fableParagraph.textContent = randomFable.story;
            transcribedParagraph.textContent = '';

        });
        transcribeButton.addEventListener('click', () => {
            if (!intervalId) {
                startTranscription(randomFable.moral); // Only start if not already running
            }
        });
        stopButton.addEventListener('click', stopTranscription);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });


