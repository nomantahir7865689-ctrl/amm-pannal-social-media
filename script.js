// Random Joke Generator
// Using Official Joke API

const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

let jokeCount = 0;

// DOM Elements
const jokeText = document.getElementById('jokeText');
const jokeCategory = document.getElementById('jokeCategory');
const getJokeBtn = document.getElementById('getJokeBtn');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
const loading = document.getElementById('loading');
const jokeCountDisplay = document.getElementById('jokeCount');

let currentJoke = {
    setup: '',
    punchline: '',
    type: ''
};

// Event Listeners
getJokeBtn.addEventListener('click', fetchJoke);
shareBtn.addEventListener('click', shareJoke);
copyBtn.addEventListener('click', copyJoke);

// Fetch joke from API
async function fetchJoke() {
    try {
        // Show loading state
        loading.style.display = 'block';
        getJokeBtn.disabled = true;
        shareBtn.disabled = true;
        copyBtn.disabled = true;

        const response = await fetch(JOKE_API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const data = await response.json();

        // Store the current joke
        currentJoke = {
            setup: data.setup,
            punchline: data.punchline,
            type: data.type
        };

        // Display the joke
        displayJoke(data);
        jokeCount++;
        jokeCountDisplay.textContent = jokeCount;

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeText.textContent = '😕 Oops! Failed to load a joke. Please try again.';
        jokeCategory.textContent = 'Error';
    } finally {
        // Hide loading state
        loading.style.display = 'none';
        getJokeBtn.disabled = false;
        shareBtn.disabled = false;
        copyBtn.disabled = false;
    }
}

// Display joke with animation
function displayJoke(data) {
    // Create the full joke text
    const fullJoke = `${data.setup}\n\n${data.punchline}`;
    
    // Fade out effect
    jokeText.style.opacity = '0';
    
    setTimeout(() => {
        jokeText.textContent = fullJoke;
        jokeCategory.textContent = `Type: ${data.type}`;
        
        // Fade in effect
        jokeText.style.opacity = '1';
    }, 300);
}

// Share joke via Web Share API
async function shareJoke() {
    const jokeContent = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: '🎭 Random Joke',
                text: jokeContent,
                url: window.location.href
            });
        } catch (error) {
            console.log('Share cancelled or failed:', error);
        }
    } else {
        // Fallback: Copy to clipboard
        copyJoke();
    }
}

// Copy joke to clipboard
function copyJoke() {
    const jokeContent = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
    
    navigator.clipboard.writeText(jokeContent).then(() => {
        showToast('Joke copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jokeContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Joke copied to clipboard!');
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Add fade transition to joke text
jokeText.style.transition = 'opacity 0.3s ease-in-out';

// Load initial joke on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchJoke();
});

// Keyboard shortcut: Press 'Space' to get new joke
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement === document.body) {
        e.preventDefault();
        fetchJoke();
    }
});
