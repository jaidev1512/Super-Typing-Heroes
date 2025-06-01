class TypingTutor {
    constructor() {
        this.textToType = '';
        this.startTime = null;
        this.endTime = null;
        this.isTyping = false;
        this.currentPosition = 0;
        this.errors = 0;
        this.timerInterval = null;
        this.keyboardVisible = false;
        this.sidebarVisible = false;
        
        // Initialize storage and load saved data
        this.initializeStorage();
        this.loadUserData();
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeKeyboard();
        
        // Apply saved preferences
        this.applySavedPreferences();
        this.updateSidebarContent();
    }

    initializeStorage() {
        // Define default user data structure
        this.defaultUserData = {
            stats: {
                testsCompleted: 0,
                totalTimeTyping: 0,
                totalCharactersTyped: 0,
                bestWpm: 0,
                bestAccuracy: 0,
                averageWpm: 0,
                averageAccuracy: 0
            },
            preferences: {
                keyboardVisible: false,
                defaultDifficulty: 'easy',
                defaultLength: 'medium'
            },
            recentTests: [],
            achievements: {
                firstTest: false,
                wpm25: false,
                wpm50: false,
                wpm75: false,
                wpm100: false,
                accuracy95: false,
                accuracy98: false,
                perfectTest: false,
                marathonTyper: false // 1000+ total characters
            }
        };
    }

    loadUserData() {
        try {
            const savedData = localStorage.getItem('typingTutorData');
            if (savedData) {
                this.userData = { ...this.defaultUserData, ...JSON.parse(savedData) };
            } else {
                this.userData = { ...this.defaultUserData };
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.userData = { ...this.defaultUserData };
        }
    }

    saveUserData() {
        try {
            localStorage.setItem('typingTutorData', JSON.stringify(this.userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    applySavedPreferences() {
        // Apply saved difficulty and length
        this.elements.difficultySelect.value = this.userData.preferences.defaultDifficulty;
        this.elements.lengthSelect.value = this.userData.preferences.defaultLength;
        
        // Apply keyboard visibility
        this.keyboardVisible = this.userData.preferences.keyboardVisible;
        this.elements.keyboardContainer.style.display = this.keyboardVisible ? 'block' : 'none';
        this.elements.toggleKeyboard.textContent = this.keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard';
        this.elements.showKeyboard.textContent = this.keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard';
    }

    savePreferences() {
        this.userData.preferences.keyboardVisible = this.keyboardVisible;
        this.userData.preferences.defaultDifficulty = this.elements.difficultySelect.value;
        this.userData.preferences.defaultLength = this.elements.lengthSelect.value;
        this.saveUserData();
    }

    updateSidebarContent() {
        const stats = this.userData.stats;
        const recentTests = this.userData.recentTests.slice(0, 5); // Show last 5 tests
        
        this.elements.sidebarContent.innerHTML = `
            <div class="personal-stats">
                <div class="personal-stats-header">
                    <h3>📈 Statistics</h3>
                    <button id="resetProgress" class="btn btn-small btn-danger">Reset</button>
                </div>
                <div class="personal-stats-grid">
                    <div class="personal-stat">
                        <span class="personal-stat-value">${stats.testsCompleted}</span>
                        <span class="personal-stat-label">Tests Completed</span>
                    </div>
                    <div class="personal-stat">
                        <span class="personal-stat-value">${stats.bestWpm}</span>
                        <span class="personal-stat-label">Best WPM</span>
                    </div>
                    <div class="personal-stat">
                        <span class="personal-stat-value">${stats.bestAccuracy}%</span>
                        <span class="personal-stat-label">Best Accuracy</span>
                    </div>
                    <div class="personal-stat">
                        <span class="personal-stat-value">${Math.round(stats.averageWpm)}</span>
                        <span class="personal-stat-label">Average WPM</span>
                    </div>
                    <div class="personal-stat">
                        <span class="personal-stat-value">${Math.round(stats.totalTimeTyping)}s</span>
                        <span class="personal-stat-label">Total Time</span>
                    </div>
                    <div class="personal-stat">
                        <span class="personal-stat-value">${stats.totalCharactersTyped}</span>
                        <span class="personal-stat-label">Characters</span>
                    </div>
                </div>
                
                <div class="achievements">
                    <div class="achievements-header">
                        <h4>🏆 Achievements</h4>
                    </div>
                    <div class="achievements-grid">
                        ${this.renderAchievements()}
                    </div>
                </div>
                
                ${recentTests.length > 0 ? `
                    <div class="recent-tests">
                        <h4>📊 Recent Tests</h4>
                        ${recentTests.map(test => `
                            <div class="recent-test">
                                <div class="recent-test-info">
                                    <div class="recent-test-stats">${test.wpm} WPM • ${test.accuracy}% Accuracy</div>
                                    <div class="recent-test-details">${test.difficulty} • ${test.length} • ${new Date(test.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // Re-add event listener for reset button
        const resetBtn = document.getElementById('resetProgress');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetProgress());
        }
    }

    renderAchievements() {
        const achievements = this.userData.achievements;
        const achievementsList = [
            { key: 'firstTest', name: '🎯 First Test', description: 'Complete your first typing test' },
            { key: 'wpm25', name: '🚀 Speed Demon I', description: 'Reach 25 WPM' },
            { key: 'wpm50', name: '⚡ Speed Demon II', description: 'Reach 50 WPM' },
            { key: 'wpm75', name: '🔥 Speed Demon III', description: 'Reach 75 WPM' },
            { key: 'wpm100', name: '💨 Lightning Fingers', description: 'Reach 100 WPM' },
            { key: 'accuracy95', name: '🎖️ Precise Typist', description: 'Achieve 95% accuracy' },
            { key: 'accuracy98', name: '🏆 Master Typist', description: 'Achieve 98% accuracy' },
            { key: 'perfectTest', name: '✨ Perfectionist', description: 'Complete a test with 100% accuracy' },
            { key: 'marathonTyper', name: '🏃 Marathon Typist', description: 'Type 1000+ total characters' }
        ];

        return achievementsList.map(achievement => `
            <div class="achievement ${achievements[achievement.key] ? 'earned' : 'locked'}">
                <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name.substring(2)}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `).join('');
    }

    checkAchievements(testResults) {
        const { wpm, accuracy } = testResults;
        const achievements = this.userData.achievements;
        const newAchievements = [];

        // First test
        if (!achievements.firstTest) {
            achievements.firstTest = true;
            newAchievements.push('🎯 First Test Complete!');
        }

        // WPM achievements
        if (wpm >= 25 && !achievements.wpm25) {
            achievements.wpm25 = true;
            newAchievements.push('🚀 Speed Demon I - 25 WPM!');
        }
        if (wpm >= 50 && !achievements.wpm50) {
            achievements.wpm50 = true;
            newAchievements.push('⚡ Speed Demon II - 50 WPM!');
        }
        if (wpm >= 75 && !achievements.wpm75) {
            achievements.wpm75 = true;
            newAchievements.push('🔥 Speed Demon III - 75 WPM!');
        }
        if (wpm >= 100 && !achievements.wpm100) {
            achievements.wpm100 = true;
            newAchievements.push('💨 Lightning Fingers - 100 WPM!');
        }

        // Accuracy achievements
        if (accuracy >= 95 && !achievements.accuracy95) {
            achievements.accuracy95 = true;
            newAchievements.push('🎖️ Precise Typist - 95% Accuracy!');
        }
        if (accuracy >= 98 && !achievements.accuracy98) {
            achievements.accuracy98 = true;
            newAchievements.push('🏆 Master Typist - 98% Accuracy!');
        }
        if (accuracy === 100 && !achievements.perfectTest) {
            achievements.perfectTest = true;
            newAchievements.push('✨ Perfect Test - 100% Accuracy!');
        }

        // Marathon typist
        if (this.userData.stats.totalCharactersTyped >= 1000 && !achievements.marathonTyper) {
            achievements.marathonTyper = true;
            newAchievements.push('🏃 Marathon Typist - 1000+ Characters!');
        }

        // Show achievement notifications
        if (newAchievements.length > 0) {
            this.showAchievementNotifications(newAchievements);
        }
    }

    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showNotification(achievement, 'achievement');
            }, index * 500);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            localStorage.removeItem('typingTutorData');
            this.userData = { ...this.defaultUserData };
            this.updateSidebarContent();
            this.showNotification('Progress reset successfully!', 'info');
        }
    }

    initializeElements() {
        this.elements = {
            textDisplay: document.getElementById('textToType'),
            userInput: document.getElementById('userInput'),
            newTextBtn: document.getElementById('newText'),
            resetBtn: document.getElementById('resetTest'),
            retryBtn: document.getElementById('retryTest'),
            difficultySelect: document.getElementById('difficulty'),
            lengthSelect: document.getElementById('length'),
            wpmDisplay: document.getElementById('wpm'),
            accuracyDisplay: document.getElementById('accuracy'),
            timerDisplay: document.getElementById('timer'),
            charsDisplay: document.getElementById('chars'),
            resultsSection: document.getElementById('results'),
            loadingSection: document.getElementById('loading'),
            finalWpm: document.getElementById('finalWpm'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            finalTime: document.getElementById('finalTime'),
            keyboardContainer: document.getElementById('keyboardContainer'),
            virtualKeyboard: document.getElementById('virtualKeyboard'),
            toggleKeyboard: document.getElementById('toggleKeyboard'),
            showKeyboard: document.getElementById('showKeyboard'),
            hamburgerMenu: document.getElementById('hamburgerMenu'),
            progressSidebar: document.getElementById('progressSidebar'),
            sidebarContent: document.getElementById('sidebarContent'),
            closeSidebar: document.getElementById('closeSidebar'),
            sidebarOverlay: document.getElementById('sidebarOverlay')
        };
    }

    attachEventListeners() {
        this.elements.newTextBtn.addEventListener('click', () => this.generateNewText());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.retryBtn.addEventListener('click', () => this.resetTest());
        this.elements.userInput.addEventListener('input', (e) => this.handleInput(e));
        this.elements.userInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.elements.toggleKeyboard.addEventListener('click', () => this.toggleKeyboardVisibility());
        this.elements.showKeyboard.addEventListener('click', () => this.toggleKeyboardVisibility());
        
        // Sidebar event listeners
        this.elements.hamburgerMenu.addEventListener('click', () => this.toggleSidebar());
        this.elements.closeSidebar.addEventListener('click', () => this.closeSidebarMenu());
        this.elements.sidebarOverlay.addEventListener('click', () => this.closeSidebarMenu());
        
        // Save preferences when they change
        this.elements.difficultySelect.addEventListener('change', () => this.savePreferences());
        this.elements.lengthSelect.addEventListener('change', () => this.savePreferences());
        
        // Close sidebar on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarVisible) {
                this.closeSidebarMenu();
            }
        });
    }

    initializeKeyboard() {
        // Create key mapping for special characters
        this.keyMap = {
            ' ': ' ',
            'Enter': 'Enter',
            'Backspace': 'Backspace',
            'Tab': 'Tab',
            'Shift': 'Shift',
            'CapsLock': 'CapsLock',
            'Ctrl': 'Ctrl',
            'Alt': 'Alt',
            'Win': 'Win',
            'Menu': 'Menu'
        };
    }

    toggleKeyboardVisibility() {
        this.keyboardVisible = !this.keyboardVisible;
        this.elements.keyboardContainer.style.display = this.keyboardVisible ? 'block' : 'none';
        this.elements.toggleKeyboard.textContent = this.keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard';
        this.elements.showKeyboard.textContent = this.keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard';
        
        // Save preference
        this.savePreferences();
    }

    showKeyboard() {
        if (!this.keyboardVisible) {
            this.toggleKeyboardVisibility();
        }
    }

    highlightNextKey() {
        // Clear all previous highlights
        this.clearKeyboardHighlights();
        
        if (!this.textToType || this.currentPosition >= this.textToType.length) return;
        
        const nextChar = this.textToType[this.currentPosition];
        const keyToHighlight = this.getKeyForCharacter(nextChar);
        
        if (keyToHighlight) {
            const keyElement = this.elements.virtualKeyboard.querySelector(`[data-key="${keyToHighlight}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
                
                // Add hint if it's a special character
                if (this.isSpecialCharacter(nextChar)) {
                    this.showKeyHint(keyElement, nextChar);
                }
            }
        }
    }

    getKeyForCharacter(char) {
        // Handle special cases
        if (char === ' ') return ' ';
        if (char === '\n') return 'Enter';
        if (char === '\t') return 'Tab';
        
        // Handle letters (convert to lowercase for key mapping)
        if (/[a-zA-Z]/.test(char)) {
            return char.toLowerCase();
        }
        
        // Handle numbers and symbols
        const symbolMap = {
            '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
            '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
            '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',
            ':': ';', '"': "'", '<': ',', '>': '.', '?': '/',
            '~': '`'
        };
        
        return symbolMap[char] || char;
    }

    isSpecialCharacter(char) {
        return /[!@#$%^&*()_+{}|:"<>?~]/.test(char);
    }

    showKeyHint(keyElement, char) {
        // Remove existing hints
        const existingHint = keyElement.querySelector('.next-key-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        // Add new hint
        const hint = document.createElement('div');
        hint.className = 'next-key-hint';
        hint.textContent = char;
        keyElement.appendChild(hint);
        
        // Remove hint after animation
        setTimeout(() => {
            if (hint && hint.parentNode) {
                hint.remove();
            }
        }, 2000);
    }

    showKeyFeedback(char, isCorrect) {
        const keyToShow = this.getKeyForCharacter(char);
        if (keyToShow) {
            const keyElement = this.elements.virtualKeyboard.querySelector(`[data-key="${keyToShow}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
                keyElement.classList.add(isCorrect ? 'correct' : 'incorrect');
                
                // Remove feedback class after animation
                setTimeout(() => {
                    keyElement.classList.remove('correct', 'incorrect');
                }, 600);
            }
        }
    }

    clearKeyboardHighlights() {
        const allKeys = this.elements.virtualKeyboard.querySelectorAll('.key');
        allKeys.forEach(key => {
            key.classList.remove('active', 'correct', 'incorrect');
            const hint = key.querySelector('.next-key-hint');
            if (hint) hint.remove();
        });
    }

    async generateNewText() {
        const difficulty = this.elements.difficultySelect.value;
        const length = this.elements.lengthSelect.value;
        
        this.showLoading(true);
        this.elements.newTextBtn.disabled = true;

        try {
            const response = await fetch('/api/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ difficulty, length })
            });

            const data = await response.json();
            this.textToType = data.text;
            this.displayText();
            this.resetTest();
            this.elements.userInput.disabled = false;
            this.elements.userInput.focus();
            
            // Show keyboard and highlight first key
            this.showKeyboard();
            this.highlightNextKey();
        } catch (error) {
            console.error('Error generating text:', error);
            this.textToType = "Error loading text. Please try again or check your connection.";
            this.displayText();
        } finally {
            this.showLoading(false);
            this.elements.newTextBtn.disabled = false;
        }
    }

    displayText() {
        this.elements.textDisplay.innerHTML = this.createHighlightedText();
        this.updateCharacterCount();
    }

    createHighlightedText() {
        if (!this.textToType) return '';
        
        return this.textToType.split('').map((char, index) => {
            let className = '';
            if (index < this.currentPosition) {
                const typedChar = this.elements.userInput.value[index];
                className = typedChar === char ? 'correct' : 'incorrect';
            } else if (index === this.currentPosition) {
                className = 'current';
            }
            
            return `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
        }).join('');
    }

    handleInput(e) {
        if (!this.textToType) return;
        
        const userText = e.target.value;
        const previousPosition = this.currentPosition;
        this.currentPosition = userText.length;
        
        // Start timing on first character
        if (!this.isTyping && userText.length === 1) {
            this.startTyping();
        }
        
        // Show feedback for the last typed character
        if (userText.length > 0 && previousPosition < userText.length) {
            const lastTypedChar = userText[userText.length - 1];
            const expectedChar = this.textToType[userText.length - 1];
            const isCorrect = lastTypedChar === expectedChar;
            
            this.showKeyFeedback(lastTypedChar, isCorrect);
        }
        
        // Update display and highlight next key
        this.displayText();
        this.updateStats();
        this.highlightNextKey();
        
        // Check if completed
        if (userText.length === this.textToType.length) {
            this.completeTest();
        }
    }

    handleKeydown(e) {
        // Prevent going beyond the text length
        if (this.currentPosition >= this.textToType.length && e.key !== 'Backspace') {
            e.preventDefault();
        }
        
        // Visual feedback for key press
        if (this.textToType && this.currentPosition < this.textToType.length) {
            const expectedChar = this.textToType[this.currentPosition];
            const pressedKey = e.key;
            
            // Show immediate visual feedback
            setTimeout(() => {
                if (pressedKey !== 'Backspace') {
                    const isCorrect = pressedKey === expectedChar;
                    this.showKeyFeedback(pressedKey, isCorrect);
                }
            }, 50);
        }
    }

    startTyping() {
        this.isTyping = true;
        this.startTime = Date.now();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.isTyping) {
                const elapsed = (Date.now() - this.startTime) / 1000;
                this.elements.timerDisplay.textContent = `${elapsed.toFixed(1)}s`;
            }
        }, 100);
    }

    updateStats() {
        const userText = this.elements.userInput.value;
        const elapsed = this.isTyping ? (Date.now() - this.startTime) / 1000 : 0;
        
        // Calculate WPM
        const wordsTyped = userText.trim().split(/\s+/).length;
        const wpm = elapsed > 0 ? Math.round((wordsTyped / elapsed) * 60) : 0;
        this.elements.wpmDisplay.textContent = wpm;
        
        // Calculate accuracy
        let correctChars = 0;
        let totalChars = userText.length;
        
        for (let i = 0; i < userText.length; i++) {
            if (i < this.textToType.length && userText[i] === this.textToType[i]) {
                correctChars++;
            }
        }
        
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        this.elements.accuracyDisplay.textContent = `${accuracy}%`;
        
        // Update character count
        this.updateCharacterCount();
    }

    updateCharacterCount() {
        const typed = this.elements.userInput.value.length;
        const total = this.textToType.length;
        this.elements.charsDisplay.textContent = `${typed}/${total}`;
    }

    completeTest() {
        this.isTyping = false;
        this.endTime = Date.now();
        clearInterval(this.timerInterval);
        
        // Clear keyboard highlights
        this.clearKeyboardHighlights();
        
        const totalTime = (this.endTime - this.startTime) / 1000;
        const userText = this.elements.userInput.value;
        
        // Calculate final stats
        const wordsTyped = userText.trim().split(/\s+/).length;
        const finalWpm = Math.round((wordsTyped / totalTime) * 60);
        
        let correctChars = 0;
        for (let i = 0; i < userText.length; i++) {
            if (i < this.textToType.length && userText[i] === this.textToType[i]) {
                correctChars++;
            }
        }
        const finalAccuracy = Math.round((correctChars / userText.length) * 100);
        
        // Save test results to localStorage
        this.saveTestResults({
            wpm: finalWpm,
            accuracy: finalAccuracy,
            time: totalTime,
            characters: userText.length,
            difficulty: this.elements.difficultySelect.value,
            length: this.elements.lengthSelect.value,
            date: new Date().toISOString()
        });
        
        // Display results
        this.elements.finalWpm.textContent = finalWpm;
        this.elements.finalAccuracy.textContent = `${finalAccuracy}%`;
        this.elements.finalTime.textContent = `${totalTime.toFixed(1)}s`;
        
        this.showResults(true);
        this.elements.userInput.disabled = true;
        
        // Update sidebar content (but don't auto-open)
        this.updateSidebarContent();
    }

    saveTestResults(results) {
        const stats = this.userData.stats;
        
        // Update basic stats
        stats.testsCompleted++;
        stats.totalTimeTyping += results.time;
        stats.totalCharactersTyped += results.characters;
        
        // Update best scores
        if (results.wpm > stats.bestWpm) {
            stats.bestWpm = results.wpm;
        }
        if (results.accuracy > stats.bestAccuracy) {
            stats.bestAccuracy = results.accuracy;
        }
        
        // Calculate averages
        stats.averageWpm = Math.round((stats.averageWpm * (stats.testsCompleted - 1) + results.wpm) / stats.testsCompleted);
        stats.averageAccuracy = Math.round((stats.averageAccuracy * (stats.testsCompleted - 1) + results.accuracy) / stats.testsCompleted);
        
        // Add to recent tests (keep last 10)
        this.userData.recentTests.unshift(results);
        if (this.userData.recentTests.length > 10) {
            this.userData.recentTests = this.userData.recentTests.slice(0, 10);
        }
        
        // Check for achievements
        this.checkAchievements(results);
        
        // Save to localStorage
        this.saveUserData();
    }

    resetTest() {
        this.isTyping = false;
        this.startTime = null;
        this.endTime = null;
        this.currentPosition = 0;
        this.errors = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset UI
        this.elements.userInput.value = '';
        this.elements.userInput.disabled = !this.textToType;
        this.elements.wpmDisplay.textContent = '0';
        this.elements.accuracyDisplay.textContent = '100%';
        this.elements.timerDisplay.textContent = '0s';
        this.elements.charsDisplay.textContent = '0/0';
        
        // Clear keyboard highlights
        this.clearKeyboardHighlights();
        
        this.showResults(false);
        
        if (this.textToType) {
            this.displayText();
            this.highlightNextKey();
            this.elements.userInput.focus();
        }
    }

    showResults(show) {
        this.elements.resultsSection.style.display = show ? 'block' : 'none';
    }

    showLoading(show) {
        this.elements.loadingSection.style.display = show ? 'block' : 'none';
    }

    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
        
        if (this.sidebarVisible) {
            this.openSidebarMenu();
        } else {
            this.closeSidebarMenu();
        }
    }

    openSidebarMenu() {
        this.sidebarVisible = true;
        this.elements.hamburgerMenu.classList.add('active');
        this.elements.progressSidebar.classList.add('active');
        this.elements.sidebarOverlay.classList.add('active');
        
        // Update sidebar content when opening
        this.updateSidebarContent();
        
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
    }

    closeSidebarMenu() {
        this.sidebarVisible = false;
        this.elements.hamburgerMenu.classList.remove('active');
        this.elements.progressSidebar.classList.remove('active');
        this.elements.sidebarOverlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Update the old updateStatsDisplay method to work with sidebar
    updateStatsDisplay() {
        // Update sidebar content if sidebar is visible
        if (this.sidebarVisible) {
            this.updateSidebarContent();
        }
    }
}

// Initialize the typing tutor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.typingTutor = new TypingTutor();
}); 