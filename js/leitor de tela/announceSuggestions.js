function announceSuggestion(suggestion) {
    const utterance = new SpeechSynthesisUtterance(suggestion);
    speechSynthesis.speak(utterance);
}