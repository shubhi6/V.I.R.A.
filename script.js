// DOM Elements
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const voiceButton = document.getElementById('voiceButton');
const chatMessages = document.getElementById('chatMessages');
const statusText = document.getElementById('statusText');
const statusIcon = document.getElementById('statusIcon');
const avatar = document.getElementById('avatar');

// Speech recognition and synthesis
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;
let voices = [];
let viraVoice = null;

// Load voices
function loadVoices() {
    voices = synth.getVoices();
    viraVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('woman') || 
        voice.name.includes('Zira') || 
        voice.name.includes('Google UK English Female')
    );
    
    if (!viraVoice) {
        viraVoice = voices.find(voice => voice.lang.includes('en'));
    }
}

// Initialize voices
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}

loadVoices();

// Speak function
function speak(text) {
    if (synth.speaking) {
        synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = viraVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    // Show speaking status
    statusText.textContent = "vira is speaking";
    statusIcon.style.color = "var(--accent-color)";
    avatar.querySelector('.pulse-ring').style.borderColor = "var(--accent-color)";
    
    utterance.onend = () => {
        statusText.textContent = "vira is ready";
        statusIcon.style.color = "var(--success-color)";
        avatar.querySelector('.pulse-ring').style.borderColor = "var(--secondary-color)";
    };
    
    synth.speak(utterance);
}

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return contentDiv;
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        typingDiv.appendChild(span);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Process user input
function processInput(input) {
    const lowerInput = input.toLowerCase().trim();
    
    showTyping();
    
    // Simulate processing delay
    setTimeout(() => {
        hideTyping();
        
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            const response = "Hello there! How can I assist you today?";
            addMessage(response);
            speak(response);
        } 
        else if (lowerInput.includes('your name') || lowerInput.includes('who are you')) {
            const response = "I'm vira, your personal AI assistant. I'm here to help you with various tasks!";
            addMessage(response);
            speak(response);
        }
        else if (lowerInput.includes('search for') || lowerInput.includes('find') || lowerInput.includes('look up')) {
            handleSearch(lowerInput);
        }
        else if (lowerInput.includes('youtube') || lowerInput.includes('video') || lowerInput.includes('watch')) {
            handleYouTubeSearch(lowerInput);
        }
        else if (lowerInput.includes('open') || lowerInput.includes('launch') || lowerInput.includes('file') || lowerInput.includes('folder')) {
            handleOpenCommand(lowerInput);
        }
        else if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
            const response = "You're welcome! Is there anything else I can help you with?";
            addMessage(response);
            speak(response);
        }
        else {
            const response = "I'm not sure I understand. Can you try asking differently? I can help with web searches, YouTube videos, and opening files or folders.";
            addMessage(response);
            speak(response);
        }
    }, 1500);
}

// Handle search commands
function handleSearch(input) {
    let query = input.replace('search for', '')
                    .replace('find', '')
                    .replace('look up', '')
                    .replace('on google', '')
                    .trim();
    
    if (!query) {
        const response = "What would you like me to search for?";
        addMessage(response);
        speak(response);
        return;
    }
    
    const response = `Searching Google for "${query}". Would you like me to open the results in a new tab?`;
    const messageElement = addMessage(response);
    speak(response);
    
    // Add action button
    const button = document.createElement('button');
    button.className = 'action-button';
    button.textContent = 'Open Google Search';
    button.onclick = () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };
    messageElement.appendChild(button);
}

// Handle YouTube search
function handleYouTubeSearch(input) {
    let query = input.replace('search for', '')
                    .replace('find', '')
                    .replace('look up', '')
                    .replace('on youtube', '')
                    .replace('youtube', '')
                    .replace('video', '')
                    .replace('watch', '')
                    .trim();
    
    if (!query) {
        const response = "What would you like me to search for on YouTube?";
        addMessage(response);
        speak(response);
        return;
    }
    
    const response = `Searching YouTube for "${query}". Would you like me to open the results in a new tab?`;
    const messageElement = addMessage(response);
    speak(response);
    
    // Add action button
    const button = document.createElement('button');
    button.className = 'action-button';
    button.textContent = 'Open YouTube Search';
    button.onclick = () => {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
    };
    messageElement.appendChild(button);
}

// Handle open commands
function handleOpenCommand(input) {
    if (input.includes('file')) {
        const response = "I'm sorry, but for security reasons, web browsers don't allow direct access to your files. However, you can describe the file you're looking for and I can try to help you find it.";
        addMessage(response);
        speak(response);
    }
    else if (input.includes('folder')) {
        const response = "I can't directly open folders in your system from a web browser due to security restrictions. You can tell me which folder you're looking for and I can guide you on how to find it.";
        addMessage(response);
        speak(response);
    }
    else {
        const response = "I can help you search for things online or find videos on YouTube. What would you like me to do?";
        addMessage(response);
        speak(response);
    }
}

// Event listeners
sendButton.addEventListener('click', () => {
    const input = userInput.value.trim();
    if (input) {
        addMessage(input, true);
        userInput.value = '';
        processInput(input);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = userInput.value.trim();
        if (input) {
            addMessage(input, true);
            userInput.value = '';
            processInput(input);
        }
    }
});

voiceButton.addEventListener('click', () => {
    if (!SpeechRecognition) {
        const response = "Sorry, your browser doesn't support speech recognition. Please try Chrome or Edge.";
        addMessage(response);
        speak(response);
        return;
    }
    
    if (recognition.recording) {
        recognition.stop();
        return;
    }
    
    try {
        recognition.start();
        statusText.textContent = "Listening...";
        statusIcon.style.color = "var(--warning-color)";
        voiceButton.querySelector('i').className = 'fas fa-microphone-slash';
    } catch (e) {
        console.error(e);
        const response = "Sorry, I couldn't start the microphone. Please check your permissions.";
        addMessage(response);
        speak(response);
    }
});

recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    userInput.value = speechResult;
    addMessage(speechResult, true);
    processInput(speechResult);
};

recognition.onend = () => {
    statusText.textContent = "vira is ready";
    statusIcon.style.color = "var(--success-color)";
    voiceButton.querySelector('i').className = 'fas fa-microphone';
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    statusText.textContent = "vira is ready";
    statusIcon.style.color = "var(--success-color)";
    voiceButton.querySelector('i').className = 'fas fa-microphone';
    
    const response = "Sorry, I didn't catch that. Could you please try again or type your request?";
    addMessage(response);
    speak(response);
};

// Initialize
addMessage("You can ask me to search the web, find YouTube videos, or help with files and folders. Try saying 'Search for AI technology' or 'Find cooking videos on YouTube'.", false);