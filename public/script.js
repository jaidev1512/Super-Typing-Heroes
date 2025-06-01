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
            console.log('Attempting to generate text with:', { difficulty, length });
            
            const response = await fetch('/api/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ difficulty, length })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            
            if (!data.text) {
                throw new Error('No text received from server');
            }

            this.textToType = data.text;
            this.displayText();
            this.resetTest();
            this.elements.userInput.disabled = false;
            this.elements.userInput.focus();
            
            // Show keyboard and highlight first key
            this.showKeyboard();
            this.highlightNextKey();
            
            console.log('Successfully generated text:', this.textToType);
        } catch (error) {
            console.error('Error generating text:', error);
            
            // Fallback to local generation if API fails
            console.log('Falling back to local text generation...');
            this.textToType = this.generateFallbackText(difficulty, length);
            this.displayText();
            this.resetTest();
            this.elements.userInput.disabled = false;
            this.elements.userInput.focus();
            
            // Show keyboard and highlight first key
            this.showKeyboard();
            this.highlightNextKey();
            
            // Show a non-intrusive notification
            this.showNotification('🌟 Using offline text generation mode!', 'info');
        } finally {
            this.showLoading(false);
            this.elements.newTextBtn.disabled = false;
        }
    }

    generateFallbackText(difficulty, length) {
        // Enhanced fallback text generation with multiple options
        const fallbackTexts = {
            easy: {
                short: [
                    "The cat sat on the mat. Dogs run fast in the park.",
                    "Birds fly high in the sky. Fish swim in the water.",
                    "Children play games all day. Books help us learn new things.",
                    "The sun shines bright today. Trees grow tall and green.",
                    "Cars drive on the road. People walk on the sidewalk."
                ],
                medium: [
                    "The sun is bright today. Birds fly high in the blue sky. Children play games in the yard. Books help us learn new things.",
                    "Dogs love to run and play. Cats like to sleep in the sun. People enjoy reading good books. Music makes everyone happy.",
                    "The garden has many flowers. Children like to play outside. Food tastes better when shared. Friends make life more fun.",
                    "Rain helps plants grow big. The moon shines at night. Summer days are warm and nice. Winter brings snow and ice.",
                    "School teaches us many things. Sports keep our bodies strong. Art lets us be creative. Science helps us understand the world."
                ],
                long: [
                    "The cat sat on the warm mat near the window. Dogs run fast in the green park every morning. Children play fun games in the big yard. Books help us learn many new and interesting things. Music makes people happy and cheerful.",
                    "Every morning the sun rises bright and beautiful. Children wake up ready for a new day of learning and playing. Teachers help students discover amazing things about the world. Friends share stories and laugh together during lunch time.",
                    "In the garden there are many colorful flowers blooming. Bees buzz from flower to flower collecting sweet nectar. Butterflies dance in the warm summer air. Birds sing cheerful songs from the tall green trees.",
                    "The ocean waves crash against the sandy shore. Seagulls fly overhead looking for food to eat. Children build sandcastles and collect pretty shells. The salty air smells fresh and clean by the water.",
                    "Winter snow covers the ground like a white blanket. Children love to build snowmen and throw snowballs. Hot chocolate tastes wonderful on cold winter days. Families gather around warm fires telling stories."
                ]
            },
            medium: {
                short: [
                    "Technology advances rapidly in modern society. Education develops critical thinking skills effectively.",
                    "Scientific research contributes to human knowledge. Digital communication connects people worldwide instantly.",
                    "Environmental conservation requires collective global action. Innovation drives economic growth and prosperity.",
                    "Cultural diversity enriches our understanding of humanity. Healthcare improvements extend human longevity significantly.",
                    "Transportation systems facilitate global commerce efficiently. Renewable energy sources promote environmental sustainability."
                ],
                medium: [
                    "Computer science involves systematic problem-solving methodologies. Educational institutions foster intellectual development and creativity. Professional communication requires clear and precise language skills.",
                    "Modern technology transforms how we interact with information. Social networks enable global connectivity and collaboration. Digital literacy becomes increasingly important for career success.",
                    "Scientific methodology guides researchers toward reliable conclusions. Environmental sustainability requires innovative technological solutions. Economic systems adapt to changing demographic and social patterns.",
                    "Healthcare professionals utilize advanced diagnostic techniques for treatment. Educational systems incorporate multimedia resources for enhanced learning. Communication technology bridges geographical and cultural barriers effectively.",
                    "Innovation drives competitive advantage in global markets. Collaborative teamwork produces superior project outcomes consistently. Quality management ensures sustainable organizational performance and growth."
                ],
                long: [
                    "Technology advances rapidly in our increasingly connected modern society. Educational institutions foster intellectual development and promote creative thinking among students. Professional communication requires clear, precise, and effective language skills. Scientific research contributes significantly to our understanding of complex phenomena.",
                    "Digital transformation influences every aspect of contemporary business operations. Organizations invest heavily in technological infrastructure to maintain competitive advantages. Workforce development programs prepare employees for evolving industry requirements. Global collaboration becomes essential for addressing complex international challenges.",
                    "Environmental sustainability demands innovative approaches to resource management and conservation. Climate change mitigation requires coordinated efforts from government, industry, and individual citizens. Renewable energy technologies offer promising solutions for reducing carbon emissions. Sustainable development practices balance economic growth with environmental protection.",
                    "Healthcare innovation improves patient outcomes through advanced medical technologies. Telemedicine expands access to quality healthcare services in remote areas. Preventive medicine emphasizes lifestyle factors that promote long-term wellness. Medical research continues to develop treatments for previously incurable diseases.",
                    "Educational technology enhances learning experiences through interactive digital platforms. Online learning provides flexible opportunities for continuous professional development. Collaborative learning environments foster critical thinking and problem-solving skills. Assessment methodologies evolve to measure diverse forms of student achievement."
                ]
            },
            hard: {
                short: [
                    "Entrepreneurship requires multidisciplinary knowledge and innovative thinking. Biotechnology revolutionizes pharmaceutical development processes.",
                    "Cryptocurrency employs cryptographic algorithms for secure transactions. Nanotechnology enables precise molecular-level manufacturing capabilities.",
                    "Artificial intelligence enhances decision-making through predictive analytics. Quantum computing promises exponential computational performance improvements.",
                    "Bioengineering integrates engineering principles with biological systems effectively. Telecommunications infrastructure supports global information exchange networks.",
                    "Pharmaceutical research utilizes sophisticated molecular modeling techniques. Semiconductor technology drives modern electronic device miniaturization."
                ],
                medium: [
                    "Artificial intelligence systems utilize sophisticated algorithms for complex data analysis. Cryptocurrency technology employs cryptographic protocols for secure financial transactions. Nanotechnology applications demonstrate unprecedented precision in molecular engineering.",
                    "Bioengineering combines biological principles with engineering methodologies for innovative solutions. Telecommunications networks enable high-speed data transmission across global infrastructure. Pharmaceutical development requires rigorous clinical testing and regulatory approval processes.",
                    "Quantum computing leverages quantum mechanical phenomena for exponential processing capabilities. Cybersecurity protocols protect sensitive information from sophisticated attack vectors. Biotechnology applications transform agricultural production and environmental remediation.",
                    "Machine learning algorithms process vast datasets to identify complex patterns and correlations. Blockchain technology ensures transparent and immutable transaction records. Genomic sequencing advances personalized medicine and therapeutic interventions.",
                    "Microprocessor architecture continues evolving toward increased efficiency and performance optimization. Environmental engineering addresses pollution control and sustainable resource management. Robotics integration transforms manufacturing processes and service delivery."
                ],
                long: [
                    "Entrepreneurship requires comprehensive multidisciplinary knowledge and innovative problem-solving capabilities. Biotechnology revolutionizes pharmaceutical development through advanced molecular engineering techniques. Artificial intelligence systems utilize sophisticated machine learning algorithms for complex pattern recognition and data analysis. Cryptocurrency platforms employ advanced cryptographic protocols to ensure secure, decentralized financial transactions.",
                    "Nanotechnology applications demonstrate unprecedented precision in molecular-level manufacturing and materials engineering. Quantum computing harnesses quantum mechanical phenomena to achieve exponential computational performance improvements. Bioengineering integrates biological systems with engineering principles to develop innovative medical devices and therapeutic solutions. Telecommunications infrastructure supports high-bandwidth global connectivity.",
                    "Cybersecurity frameworks implement multi-layered defense strategies against increasingly sophisticated attack vectors. Renewable energy technologies optimize efficiency through advanced materials science and engineering innovations. Genomic research enables personalized medicine approaches through comprehensive DNA sequencing and analysis. Robotics automation transforms manufacturing processes.",
                    "Semiconductor fabrication utilizes cutting-edge lithography techniques to achieve nanometer-scale precision. Environmental engineering addresses complex pollution control challenges through interdisciplinary approaches. Machine learning architectures process massive datasets to extract meaningful insights and predictive models. Blockchain protocols ensure transparent, immutable transaction verification.",
                    "Pharmaceutical development integrates computational drug design with clinical trial methodologies. Aerospace engineering advances propulsion systems for space exploration missions. Materials science research develops novel composites with enhanced strength-to-weight ratios. Telecommunications protocols enable ultra-low latency global communication networks."
                ]
            }
        };

        const difficultyTexts = fallbackTexts[difficulty] || fallbackTexts.medium;
        const textArray = difficultyTexts[length] || difficultyTexts.medium;
        
        // Return a random text from the array
        return textArray[Math.floor(Math.random() * textArray.length)];
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