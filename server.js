const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Local word banks for generating typing content
const wordBanks = {
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

const sentenceStarters = [
    'The', 'A', 'An', 'This', 'That', 'These', 'Those', 'Every', 'Each', 'Some', 'Many', 'Most', 'All', 'Few', 'Several'
];

const connectors = [
    'and', 'but', 'or', 'so', 'because', 'however', 'therefore', 'moreover', 'furthermore', 'nevertheless', 'although', 'while', 'since', 'when', 'where', 'if', 'unless', 'until'
];

class LocalWordGenerator {
    constructor() {
        this.usedCombinations = new Set();
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    generateEasyText(targetLength) {
        const { common, nouns, verbs } = wordBanks.easy;
        let text = '';
        let sentenceCount = 0;
        const maxSentences = targetLength === 'short' ? 2 : targetLength === 'medium' ? 3 : 4;

        while (sentenceCount < maxSentences) {
            let sentence = this.getRandomElement(sentenceStarters);
            const sentenceLength = targetLength === 'short' ? 4 + Math.floor(Math.random() * 3) : 
                                 targetLength === 'medium' ? 6 + Math.floor(Math.random() * 4) : 
                                 8 + Math.floor(Math.random() * 5);

            for (let i = 1; i < sentenceLength; i++) {
                if (i === 1) {
                    sentence += ' ' + this.getRandomElement(nouns);
                } else if (i === 2) {
                    sentence += ' ' + this.getRandomElement(verbs);
                } else {
                    const wordType = Math.random();
                    if (wordType < 0.5) {
                        sentence += ' ' + this.getRandomElement(common);
                    } else if (wordType < 0.8) {
                        sentence += ' ' + this.getRandomElement(nouns);
                    } else {
                        sentence += ' ' + this.getRandomElement(verbs);
                    }
                }
            }

            sentence += '.';
            text += (sentenceCount > 0 ? ' ' : '') + sentence;
            sentenceCount++;
        }

        return text;
    }

    generateMediumText(targetLength) {
        const { words, adjectives } = wordBanks.medium;
        const { common } = wordBanks.easy;
        let text = '';
        let sentenceCount = 0;
        const maxSentences = targetLength === 'short' ? 2 : targetLength === 'medium' ? 4 : 5;

        while (sentenceCount < maxSentences) {
            let sentence = this.getRandomElement(sentenceStarters);
            const sentenceLength = targetLength === 'short' ? 5 + Math.floor(Math.random() * 3) : 
                                 targetLength === 'medium' ? 7 + Math.floor(Math.random() * 4) : 
                                 9 + Math.floor(Math.random() * 6);

            for (let i = 1; i < sentenceLength; i++) {
                const wordType = Math.random();
                if (wordType < 0.3) {
                    sentence += ' ' + this.getRandomElement(words);
                } else if (wordType < 0.5) {
                    sentence += ' ' + this.getRandomElement(adjectives);
                } else {
                    sentence += ' ' + this.getRandomElement(common);
                }
            }

            // Add some punctuation variety
            const endings = ['.', '.', '.', '!', '?'];
            sentence += this.getRandomElement(endings);
            
            // Sometimes add a connector for compound sentences
            if (sentenceCount < maxSentences - 1 && Math.random() < 0.3) {
                sentence += ' ' + this.getRandomElement(connectors);
                const extraLength = 3 + Math.floor(Math.random() * 3);
                for (let i = 0; i < extraLength; i++) {
                    sentence += ' ' + this.getRandomElement([...words, ...common]);
                }
                sentence += '.';
            }

            text += (sentenceCount > 0 ? ' ' : '') + sentence;
            sentenceCount++;
        }

        return text;
    }

    generateHardText(targetLength) {
        const { words, technical, numbers, punctuation } = wordBanks.hard;
        const { words: mediumWords } = wordBanks.medium;
        let text = '';
        let sentenceCount = 0;
        const maxSentences = targetLength === 'short' ? 2 : targetLength === 'medium' ? 3 : 4;

        while (sentenceCount < maxSentences) {
            let sentence = this.getRandomElement(sentenceStarters);
            const sentenceLength = targetLength === 'short' ? 6 + Math.floor(Math.random() * 4) : 
                                 targetLength === 'medium' ? 8 + Math.floor(Math.random() * 5) : 
                                 10 + Math.floor(Math.random() * 6);

            for (let i = 1; i < sentenceLength; i++) {
                const wordType = Math.random();
                if (wordType < 0.4) {
                    sentence += ' ' + this.getRandomElement(words);
                } else if (wordType < 0.6) {
                    sentence += ' ' + this.getRandomElement(technical);
                } else if (wordType < 0.8) {
                    sentence += ' ' + this.getRandomElement(mediumWords);
                } else if (wordType < 0.9) {
                    sentence += ' ' + this.getRandomElement(numbers);
                } else {
                    // Add some punctuation within the sentence
                    const punct = this.getRandomElement([',', ';', ':', '-']);
                    sentence += punct + ' ' + this.getRandomElement(technical);
                }
            }

            // Add complex punctuation
            const endings = ['.', '!', '?', '...'];
            sentence += this.getRandomElement(endings);

            // Add quotes or parentheses sometimes
            if (Math.random() < 0.2) {
                const quotedWord = this.getRandomElement(technical);
                sentence += ` "${quotedWord}" is important.`;
            }

            // Add numbers and symbols
            if (Math.random() < 0.3) {
                const num = this.getRandomElement(numbers);
                const symbol = this.getRandomElement(['%', '$', '#', '@']);
                sentence += ` (${num}${symbol})`;
            }

            text += (sentenceCount > 0 ? ' ' : '') + sentence;
            sentenceCount++;
        }

        return text;
    }

    generateText(difficulty, length) {
        switch (difficulty) {
            case 'easy':
                return this.generateEasyText(length);
            case 'medium':
                return this.generateMediumText(length);
            case 'hard':
                return this.generateHardText(length);
            default:
                return this.generateEasyText(length);
        }
    }
}

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