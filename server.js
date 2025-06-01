const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ORIGINAL LOCAL WORD BANKS - Preserved for backward compatibility
// These are kept for fallback in case the enhanced system fails
const originalWordBanks = {
    easy: {
        common: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'],
        nouns: ['cat', 'dog', 'car', 'home', 'book', 'tree', 'door', 'hand', 'head', 'eye', 'face', 'place', 'work', 'life', 'world', 'house', 'water', 'food', 'time', 'year', 'day', 'night', 'light', 'way', 'man', 'woman', 'child', 'family', 'friend', 'school', 'room', 'table', 'chair', 'paper', 'money'],
        verbs: ['is', 'go', 'see', 'get', 'make', 'come', 'take', 'know', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'move', 'live', 'help', 'play', 'turn', 'show', 'hear', 'talk', 'bring', 'write', 'sit', 'stand', 'run', 'walk']
    },
    medium: {
        words: ['computer', 'program', 'language', 'keyboard', 'monitor', 'practice', 'improve', 'accuracy', 'speed', 'challenge', 'exercise', 'training', 'development', 'technology', 'internet', 'website', 'application', 'software', 'hardware', 'network', 'database', 'security', 'performance', 'efficiency', 'productivity', 'innovation', 'creativity', 'problem', 'solution', 'project', 'business', 'professional', 'experience', 'knowledge', 'education', 'learning', 'student', 'teacher', 'research', 'analysis'],
        adjectives: ['quick', 'fast', 'slow', 'easy', 'hard', 'simple', 'complex', 'beautiful', 'important', 'interesting', 'different', 'special', 'amazing', 'wonderful', 'excellent', 'perfect', 'modern', 'advanced', 'professional', 'technical', 'digital', 'electronic', 'automatic', 'efficient', 'effective', 'reliable', 'secure', 'popular', 'successful', 'powerful']
    },
    hard: {
        words: ['phenomenon', 'psychology', 'philosophical', 'extraordinary', 'unprecedented', 'revolutionary', 'sophisticated', 'methodology', 'implementation', 'optimization', 'configuration', 'authentication', 'authorization', 'administration', 'infrastructure', 'architecture', 'compatibility', 'functionality', 'accessibility', 'responsibility', 'accountability', 'sustainability', 'entrepreneurship', 'characteristics', 'circumstances', 'consciousness', 'consequences', 'requirements', 'specifications', 'documentation'],
        technical: ['algorithm', 'database', 'framework', 'debugging', 'refactoring', 'deployment', 'scalability', 'middleware', 'API', 'JSON', 'XML', 'HTTP', 'HTTPS', 'encryption', 'decryption', 'validation', 'serialization', 'asynchronous', 'synchronization', 'polymorphism', 'inheritance', 'encapsulation'],
        numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '25', '50', '100', '500', '1000', '2023', '2024'],
        punctuation: ['.', ',', '!', '?', ';', ':', '"', "'", '(', ')', '-', '_', '@', '#', '$', '%', '&', '*']
    }
};

// ORIGINAL SENTENCE HELPERS - Preserved for backward compatibility
const originalSentenceStarters = [
    'The', 'A', 'An', 'This', 'That', 'These', 'Those', 'Every', 'Each', 'Some', 'Many', 'Most', 'All', 'Few', 'Several'
];

const originalConnectors = [
    'and', 'but', 'or', 'so', 'because', 'however', 'therefore', 'moreover', 'furthermore', 'nevertheless', 'although', 'while', 'since', 'when', 'where', 'if', 'unless', 'until'
];

class LocalWordGenerator {
    constructor() {
        // Track combinations to avoid repetition
        this.usedCombinations = new Set();
        
        // ENHANCED WORD DATABASE - Comprehensive themed collections for infinite variety
        this.enhancedDatabase = {
            // EASY LEVEL - Child-friendly themed content
            easy: {
                themes: {
                    animals: {
                        nouns: ['cat', 'dog', 'bird', 'fish', 'cow', 'pig', 'sheep', 'horse', 'duck', 'hen', 'rabbit', 'mouse', 'bear', 'lion', 'tiger', 'elephant', 'monkey', 'zebra', 'giraffe', 'whale'],
                        verbs: ['run', 'jump', 'swim', 'fly', 'bark', 'meow', 'chirp', 'hop', 'crawl', 'climb', 'hunt', 'sleep', 'eat', 'drink', 'play', 'hide'],
                        adjectives: ['furry', 'soft', 'fast', 'slow', 'big', 'small', 'cute', 'wild', 'tame', 'loud', 'quiet', 'friendly', 'scary', 'funny']
                    },
                    nature: {
                        nouns: ['tree', 'flower', 'grass', 'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'rock', 'mountain', 'river', 'ocean', 'beach', 'forest'],
                        verbs: ['grow', 'bloom', 'shine', 'flow', 'blow', 'fall', 'rise', 'set', 'sparkle', 'wave', 'rustle', 'dance'],
                        adjectives: ['green', 'tall', 'short', 'pretty', 'fresh', 'clean', 'warm', 'cool', 'wet', 'dry', 'sunny', 'cloudy']
                    },
                    food: {
                        nouns: ['apple', 'banana', 'orange', 'bread', 'milk', 'water', 'cake', 'cookie', 'pizza', 'ice cream', 'sandwich', 'soup'],
                        verbs: ['eat', 'drink', 'taste', 'cook', 'bake', 'mix', 'cut', 'serve', 'share', 'enjoy'],
                        adjectives: ['sweet', 'sour', 'salty', 'spicy', 'hot', 'cold', 'fresh', 'tasty', 'yummy', 'healthy']
                    }
                },
                patterns: [
                    'The {adjective} {noun} {verb} {adverb}.',
                    '{noun} and {noun} {verb} together.',
                    'I {verb} the {adjective} {noun}.',
                    'My {noun} is very {adjective}.',
                    'The {noun} {verb} in the {noun}.'
                ]
            },
            // MEDIUM LEVEL - More complex vocabulary
            medium: {
                themes: {
                    technology: {
                        nouns: ['computer', 'internet', 'website', 'software', 'program', 'device', 'network', 'database', 'security', 'data'],
                        verbs: ['download', 'upload', 'connect', 'install', 'update', 'process', 'analyze', 'develop', 'optimize'],
                        adjectives: ['digital', 'electronic', 'efficient', 'secure', 'modern', 'advanced', 'innovative', 'reliable']
                    },
                    education: {
                        nouns: ['school', 'student', 'teacher', 'knowledge', 'learning', 'education', 'skill', 'research', 'discovery'],
                        verbs: ['learn', 'teach', 'study', 'understand', 'discover', 'research', 'analyze', 'improve'],
                        adjectives: ['educational', 'academic', 'intellectual', 'skilled', 'creative', 'motivated']
                    }
                },
                patterns: [
                    'The {adjective} {noun} {verb} {adjective} {noun} efficiently.',
                    'Modern {noun} {verb} through {adjective} systems.',
                    'Students {verb} {adjective} {noun} to improve.',
                    'Technology {verb} how we {verb} and communicate.'
                ]
            },
            // HARD LEVEL - Advanced vocabulary and technical terms
            hard: {
                themes: {
                    science: {
                        nouns: ['research', 'experiment', 'hypothesis', 'theory', 'analysis', 'data', 'evidence', 'discovery'],
                        verbs: ['investigate', 'analyze', 'synthesize', 'validate', 'hypothesize', 'demonstrate'],
                        adjectives: ['scientific', 'empirical', 'theoretical', 'experimental', 'statistical', 'rigorous']
                    },
                    programming: {
                        nouns: ['algorithm', 'function', 'variable', 'array', 'object', 'method', 'optimization', 'deployment'],
                        verbs: ['compile', 'execute', 'debug', 'optimize', 'implement', 'refactor', 'deploy'],
                        adjectives: ['asynchronous', 'recursive', 'polymorphic', 'scalable', 'efficient', 'robust']
                    }
                },
                patterns: [
                    'Advanced {noun} {verb} complex {adjective} {noun} systematically.',
                    'Researchers {verb} {adjective} {noun} through methodologies.',
                    'Sophisticated {noun} {verb} {adjective} solutions precisely.'
                ]
            }
        };
    }

    // ENHANCED GENERATION - Primary method using new database
    generateText(difficulty, length) {
        try {
            return this.generateEnhancedText(difficulty, length);
        } catch (error) {
            console.log('Enhanced generation failed, using fallback');
            return this.generateFallbackText(difficulty, length);
        }
    }

    generateEnhancedText(difficulty, length) {
        const database = this.enhancedDatabase[difficulty];
        if (!database) {
            throw new Error(`No enhanced database for difficulty: ${difficulty}`);
        }

        const lengthConfig = {
            short: { sentences: 2 },
            medium: { sentences: 4 },
            long: { sentences: 6 }
        };

        const config = lengthConfig[length] || lengthConfig.medium;
        const themes = Object.keys(database.themes);
        let text = '';
        const usedPatterns = new Set();

        for (let i = 0; i < config.sentences; i++) {
            // Select different themes for variety
            const selectedTheme = themes[i % themes.length];
            const themeData = database.themes[selectedTheme];

            // Generate sentence using pattern-based approach
            const sentence = this.generatePatternSentence(database, themeData, usedPatterns);
            
            text += sentence;
            if (i < config.sentences - 1) {
                text += ' ';
            }
        }

        return text.trim();
    }

    generatePatternSentence(database, themeData, usedPatterns) {
        // Select unused pattern or reset if all used
        if (usedPatterns.size >= database.patterns.length) {
            usedPatterns.clear();
        }

        let pattern;
        do {
            pattern = this.getRandomElement(database.patterns);
        } while (usedPatterns.has(pattern));
        
        usedPatterns.add(pattern);

        // Replace placeholders with theme words
        let sentence = pattern;
        
        sentence = sentence.replace(/{noun}/g, () => {
            return this.getRandomElement(themeData.nouns || ['thing']);
        });

        sentence = sentence.replace(/{verb}/g, () => {
            return this.getRandomElement(themeData.verbs || ['happen']);
        });

        sentence = sentence.replace(/{adjective}/g, () => {
            return this.getRandomElement(themeData.adjectives || ['good']);
        });

        sentence = sentence.replace(/{adverb}/g, () => {
            const adjective = this.getRandomElement(themeData.adjectives || ['quick']);
            return this.convertToAdverb(adjective);
        });

        return sentence;
    }

    convertToAdverb(adjective) {
        // Convert adjectives to adverbs with proper grammar
        if (adjective.endsWith('y')) {
            return adjective.slice(0, -1) + 'ily';
        } else if (adjective.endsWith('le')) {
            return adjective.slice(0, -2) + 'ly';
        } else {
            return adjective + 'ly';
        }
    }

    // FALLBACK GENERATION - Original simple method preserved for reliability
    generateFallbackText(difficulty, length) {
        const fallbackTexts = {
            easy: {
                short: ['The cat sits on the mat. Dogs run in the park.', 'Birds fly in the sky. Fish swim in water.', 'Children play with toys. Books help us learn.'],
                medium: ['The sun shines bright today. Birds fly high in the blue sky. Children play games in the yard.', 'Dogs love to run and play. Cats like to sleep in the sun. People enjoy reading books.'],
                long: ['The cat sat on the warm mat near the window. Dogs run fast in the green park every morning. Children play fun games in the big yard. Books help us learn many new things.']
            },
            medium: {
                short: ['Technology advances rapidly in society. Education develops critical thinking skills.', 'Computer systems process information efficiently. Students learn through interactive methods.'],
                medium: ['Modern technology transforms how we communicate. Educational institutions foster intellectual development. Professional skills require continuous learning.'],
                long: ['Technology advances rapidly in our connected society. Educational institutions foster development and creativity. Professional communication requires clear language skills.']
            },
            hard: {
                short: ['Advanced algorithms process complex data systematically. Research methodologies validate scientific hypotheses.'],
                medium: ['Sophisticated computational systems analyze multidimensional datasets. Researchers investigate phenomena through empirical methodologies.'],
                long: ['Contemporary scientific research employs sophisticated methodologies. Advanced computational algorithms process complex datasets efficiently. Theoretical frameworks validate empirical observations systematically.']
            }
        };

        const difficultyTexts = fallbackTexts[difficulty] || fallbackTexts.medium;
        const textArray = difficultyTexts[length] || difficultyTexts.medium;
        
        return textArray[Math.floor(Math.random() * textArray.length)];
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // ORIGINAL METHODS - Preserved but simplified for fallback use
    generateEasyText(targetLength) {
        return this.generateFallbackText('easy', targetLength);
    }

    generateMediumText(targetLength) {
        return this.generateFallbackText('medium', targetLength);
    }

    generateHardText(targetLength) {
        return this.generateFallbackText('hard', targetLength);
    }
}

// Create enhanced word generator instance
const wordGenerator = new LocalWordGenerator();

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate words endpoint - now completely local
app.post('/api/generate-text', (req, res) => {
    try {
        const { difficulty = 'easy', length = 'medium' } = req.body;
        const generatedText = wordGenerator.generateText(difficulty, length);
        res.json({ text: generatedText });
    } catch (error) {
        console.error('Error generating text:', error);
        // Fallback to simple text
        res.json({ text: "The quick brown fox jumps over the lazy dog. This is a simple typing test." });
    }
});

app.listen(PORT, () => {
    console.log(`Typing Tutor server running on http://localhost:${PORT}`);
    console.log('✨ Now featuring local word generation - no API keys needed!');
    console.log('Open your browser and navigate to the URL above to start typing!');
}); 