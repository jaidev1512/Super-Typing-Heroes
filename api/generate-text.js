// Vercel serverless function for generating typing text

class LocalWordGenerator {
    constructor() {
        this.wordBanks = {
            easy: {
                nouns: ['cat', 'dog', 'house', 'tree', 'car', 'book', 'phone', 'water', 'food', 'sun', 'moon', 'star', 'bird', 'fish', 'flower', 'table', 'chair', 'door', 'window', 'bed', 'computer', 'music', 'game', 'friend', 'family'],
                verbs: ['run', 'walk', 'jump', 'play', 'eat', 'sleep', 'read', 'write', 'sing', 'dance', 'swim', 'fly', 'drive', 'cook', 'clean', 'work', 'study', 'laugh', 'cry', 'smile'],
                adjectives: ['big', 'small', 'fast', 'slow', 'happy', 'sad', 'hot', 'cold', 'new', 'old', 'good', 'bad', 'nice', 'fun', 'easy', 'hard', 'soft', 'loud', 'quiet', 'bright'],
                common: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']
            },
            medium: {
                nouns: ['computer', 'technology', 'science', 'knowledge', 'education', 'development', 'environment', 'information', 'communication', 'transportation', 'organization', 'investigation', 'presentation', 'application', 'demonstration', 'explanation', 'celebration', 'conversation', 'imagination', 'concentration'],
                verbs: ['analyze', 'evaluate', 'demonstrate', 'investigate', 'communicate', 'collaborate', 'organize', 'develop', 'implement', 'understand', 'recognize', 'establish', 'maintain', 'achieve', 'improve', 'create', 'design', 'manage', 'support', 'contribute'],
                adjectives: ['innovative', 'efficient', 'comprehensive', 'significant', 'professional', 'educational', 'technological', 'environmental', 'international', 'organizational', 'fundamental', 'traditional', 'practical', 'theoretical', 'analytical', 'systematic', 'strategic', 'creative', 'productive', 'effective'],
                technical: ['algorithm', 'database', 'interface', 'protocol', 'framework', 'architecture', 'methodology', 'optimization', 'integration', 'configuration', 'documentation', 'specification', 'implementation', 'verification', 'authentication', 'authorization', 'encryption', 'compression', 'synchronization', 'visualization']
            },
            hard: {
                nouns: ['entrepreneurship', 'bioengineering', 'nanotechnology', 'cryptocurrency', 'artificial intelligence', 'quantum computing', 'biotechnology', 'telecommunications', 'pharmaceutical', 'aerodynamics', 'thermodynamics', 'electromagnetic', 'semiconductor', 'microprocessor', 'infrastructure', 'architecture', 'bureaucracy', 'democracy', 'philosophy', 'psychology'],
                verbs: ['authenticate', 'synchronize', 'optimize', 'synthesize', 'revolutionize', 'commercialize', 'standardize', 'systematize', 'characterize', 'conceptualize', 'hypothesize', 'materialize', 'initialize', 'categorize', 'recognize', 'emphasize', 'summarize', 'analyze', 'utilize', 'visualize'],
                adjectives: ['multidisciplinary', 'intercontinental', 'incomprehensible', 'uncharacteristic', 'disadvantageous', 'unprofessional', 'unconventional', 'extraordinary', 'unprecedented', 'sophisticated', 'revolutionary', 'controversial', 'philosophical', 'psychological', 'technological', 'environmental', 'international', 'organizational', 'educational', 'professional'],
                complex: ['JavaScript', 'TypeScript', 'Node.js', 'React.js', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'GraphQL', 'RESTful', 'API', 'JSON', 'XML', 'HTML5', 'CSS3', 'ES6+', 'async/await', 'Promise', 'callback', 'closure'],
                symbols: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/'],
                numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '42', '100', '256', '1024', '2023', '3.14', '2.71', '9.81', '299792458']
            }
        };
    }

    generateText(difficulty = 'medium', length = 'medium') {
        const wordBank = this.wordBanks[difficulty];
        if (!wordBank) {
            throw new Error(`Invalid difficulty level: ${difficulty}`);
        }

        const lengthConfig = {
            short: { sentences: 2, wordsPerSentence: [4, 8] },
            medium: { sentences: 4, wordsPerSentence: [6, 12] },
            long: { sentences: 6, wordsPerSentence: [8, 15] }
        };

        const config = lengthConfig[length] || lengthConfig.medium;
        
        let text = '';
        for (let i = 0; i < config.sentences; i++) {
            const sentenceLength = this.randomBetween(config.wordsPerSentence[0], config.wordsPerSentence[1]);
            const sentence = this.generateSentence(wordBank, difficulty, sentenceLength);
            text += sentence;
            
            if (i < config.sentences - 1) {
                text += ' ';
            }
        }

        return text.trim();
    }

    generateSentence(wordBank, difficulty, length) {
        const sentence = [];
        
        // Start with a noun or article
        if (Math.random() > 0.3 && wordBank.common) {
            const articles = ['The', 'A', 'An'];
            sentence.push(this.randomChoice(articles));
        }
        
        // Add words based on simple patterns
        for (let i = sentence.length; i < length; i++) {
            const wordType = this.chooseWordType(difficulty, i, length);
            const word = this.getRandomWord(wordBank, wordType);
            
            if (word) {
                // Capitalize first word if it's the beginning
                if (i === 0 || (sentence.length === 0)) {
                    sentence.push(this.capitalize(word));
                } else {
                    sentence.push(word);
                }
            }
        }

        // Add punctuation based on difficulty
        const punctuation = this.getPunctuation(difficulty);
        return sentence.join(' ') + punctuation;
    }

    chooseWordType(difficulty, position, totalLength) {
        const types = Object.keys(this.wordBanks[difficulty]);
        
        if (difficulty === 'hard' && Math.random() < 0.2) {
            return this.randomChoice(['complex', 'symbols', 'numbers']);
        }
        
        // Simple pattern: noun-verb-adjective-noun, etc.
        const patterns = {
            0: 'nouns',
            1: 'verbs', 
            2: 'adjectives',
            3: 'nouns'
        };
        
        return patterns[position % 4] || this.randomChoice(types);
    }

    getRandomWord(wordBank, type) {
        const words = wordBank[type];
        if (!words || words.length === 0) {
            // Fallback to any available word type
            const allTypes = Object.keys(wordBank);
            const fallbackType = this.randomChoice(allTypes);
            return wordBank[fallbackType] ? this.randomChoice(wordBank[fallbackType]) : 'word';
        }
        return this.randomChoice(words);
    }

    getPunctuation(difficulty) {
        switch (difficulty) {
            case 'easy':
                return Math.random() < 0.8 ? '.' : '!';
            case 'medium':
                const mediumPunct = ['.', '!', '?', '.', '.'];
                return this.randomChoice(mediumPunct);
            case 'hard':
                const hardPunct = ['.', '!', '?', ';', ':', '.', '!'];
                return this.randomChoice(hardPunct);
            default:
                return '.';
        }
    }

    capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { difficulty = 'medium', length = 'medium' } = req.body;
        
        const generator = new LocalWordGenerator();
        const text = generator.generateText(difficulty, length);
        
        res.status(200).json({ text });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Error generating text' });
    }
}; 