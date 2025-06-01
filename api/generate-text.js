// Vercel serverless function for generating typing text

class LocalWordGenerator {
    constructor() {
        // EXISTING WORD BANKS - Preserved for backward compatibility
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

        // NEW ENHANCED WORD DATABASE - Massive expansion for variety and themes
        this.enhancedDatabase = {
            // EASY LEVEL - Child-friendly, common words
            easy: {
                // Themed word collections for more engaging content
                themes: {
                    animals: {
                        nouns: ['cat', 'dog', 'bird', 'fish', 'cow', 'pig', 'sheep', 'horse', 'duck', 'hen', 'rabbit', 'mouse', 'bear', 'lion', 'tiger', 'elephant', 'monkey', 'zebra', 'giraffe', 'whale', 'shark', 'frog', 'bee', 'ant', 'spider', 'butterfly'],
                        verbs: ['run', 'jump', 'swim', 'fly', 'bark', 'meow', 'chirp', 'hop', 'crawl', 'climb', 'hunt', 'sleep', 'eat', 'drink', 'play', 'hide'],
                        adjectives: ['furry', 'soft', 'fast', 'slow', 'big', 'small', 'cute', 'wild', 'tame', 'loud', 'quiet', 'friendly', 'scary', 'funny']
                    },
                    colors: {
                        nouns: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'gray', 'gold', 'silver'],
                        adjectives: ['bright', 'dark', 'light', 'colorful', 'pretty', 'beautiful', 'shiny', 'dull', 'vivid', 'pale']
                    },
                    family: {
                        nouns: ['mom', 'dad', 'sister', 'brother', 'baby', 'grandma', 'grandpa', 'aunt', 'uncle', 'cousin', 'family', 'home', 'love'],
                        verbs: ['love', 'care', 'help', 'hug', 'kiss', 'share', 'teach', 'learn', 'play', 'cook', 'clean'],
                        adjectives: ['loving', 'kind', 'helpful', 'caring', 'sweet', 'gentle', 'strong', 'wise', 'fun', 'happy']
                    },
                    nature: {
                        nouns: ['tree', 'flower', 'grass', 'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'rock', 'mountain', 'river', 'ocean', 'beach', 'forest', 'park', 'garden'],
                        verbs: ['grow', 'bloom', 'shine', 'flow', 'blow', 'fall', 'rise', 'set', 'sparkle', 'wave'],
                        adjectives: ['green', 'tall', 'short', 'pretty', 'fresh', 'clean', 'warm', 'cool', 'wet', 'dry', 'sunny', 'cloudy']
                    },
                    food: {
                        nouns: ['apple', 'banana', 'orange', 'bread', 'milk', 'water', 'cake', 'cookie', 'pizza', 'ice cream', 'sandwich', 'soup', 'salad', 'cheese', 'egg'],
                        verbs: ['eat', 'drink', 'taste', 'cook', 'bake', 'mix', 'cut', 'serve', 'share', 'enjoy'],
                        adjectives: ['sweet', 'sour', 'salty', 'spicy', 'hot', 'cold', 'fresh', 'tasty', 'yummy', 'healthy']
                    }
                },
                // Sentence patterns for natural text generation
                patterns: [
                    'The {adjective} {noun} {verb} {adverb}.',
                    '{noun} and {noun} {verb} together.',
                    'I {verb} the {adjective} {noun}.',
                    'My {noun} is very {adjective}.',
                    'The {noun} {verb} in the {noun}.',
                    'We {verb} {adjective} {noun} every day.',
                    '{adjective} {noun} {verb} when {noun} {verb}.',
                    'All {noun} {verb} and {verb} happily.'
                ]
            },

            // MEDIUM LEVEL - More complex vocabulary and concepts
            medium: {
                themes: {
                    technology: {
                        nouns: ['computer', 'internet', 'website', 'software', 'program', 'application', 'device', 'smartphone', 'tablet', 'laptop', 'desktop', 'server', 'network', 'database', 'password', 'security', 'privacy', 'data', 'information', 'digital'],
                        verbs: ['download', 'upload', 'connect', 'disconnect', 'install', 'uninstall', 'update', 'backup', 'restore', 'encrypt', 'decrypt', 'process', 'analyze', 'compute', 'program', 'develop'],
                        adjectives: ['digital', 'electronic', 'automated', 'efficient', 'secure', 'modern', 'advanced', 'innovative', 'reliable', 'fast', 'powerful', 'smart']
                    },
                    education: {
                        nouns: ['school', 'student', 'teacher', 'classroom', 'lesson', 'homework', 'test', 'exam', 'grade', 'knowledge', 'learning', 'education', 'university', 'college', 'degree', 'certificate', 'skill', 'talent'],
                        verbs: ['learn', 'teach', 'study', 'practice', 'understand', 'remember', 'forget', 'discover', 'explore', 'research', 'investigate', 'analyze', 'evaluate', 'demonstrate'],
                        adjectives: ['educational', 'academic', 'intellectual', 'scholarly', 'knowledgeable', 'experienced', 'skilled', 'talented', 'creative', 'curious', 'motivated']
                    },
                    business: {
                        nouns: ['company', 'business', 'office', 'employee', 'manager', 'customer', 'client', 'service', 'product', 'project', 'meeting', 'presentation', 'report', 'strategy', 'goal', 'success', 'profit', 'revenue'],
                        verbs: ['manage', 'organize', 'plan', 'execute', 'implement', 'coordinate', 'collaborate', 'communicate', 'negotiate', 'achieve', 'succeed', 'improve', 'develop'],
                        adjectives: ['professional', 'successful', 'efficient', 'productive', 'strategic', 'competitive', 'profitable', 'sustainable', 'innovative', 'reliable']
                    }
                },
                patterns: [
                    'The {adjective} {noun} {verb} {adjective} {noun} efficiently.',
                    'Modern {noun} {verb} through {adjective} {noun} systems.',
                    'Students {verb} {adjective} {noun} to {verb} better.',
                    'Companies {verb} {adjective} {noun} for competitive advantage.',
                    'Technology {verb} how we {verb} and {verb}.',
                    'Professional {noun} {verb} {adjective} {noun} regularly.',
                    'Digital {noun} {verb} traditional {noun} methods.',
                    'Educational {noun} {verb} {adjective} learning experiences.'
                ]
            },

            // HARD LEVEL - Advanced vocabulary, technical terms, and complex structures
            hard: {
                themes: {
                    science: {
                        nouns: ['research', 'experiment', 'hypothesis', 'theory', 'methodology', 'analysis', 'data', 'evidence', 'conclusion', 'discovery', 'innovation', 'breakthrough', 'phenomenon', 'observation', 'measurement', 'variable', 'correlation', 'causation'],
                        verbs: ['hypothesize', 'investigate', 'experiment', 'observe', 'measure', 'analyze', 'synthesize', 'conclude', 'validate', 'verify', 'replicate', 'peer-review', 'publish'],
                        adjectives: ['scientific', 'empirical', 'theoretical', 'experimental', 'observational', 'quantitative', 'qualitative', 'statistical', 'significant', 'reproducible']
                    },
                    programming: {
                        nouns: ['algorithm', 'function', 'variable', 'array', 'object', 'class', 'method', 'parameter', 'argument', 'return', 'loop', 'condition', 'exception', 'debugging', 'optimization', 'refactoring', 'deployment'],
                        verbs: ['compile', 'execute', 'debug', 'optimize', 'refactor', 'deploy', 'implement', 'inherit', 'encapsulate', 'instantiate', 'serialize', 'deserialize', 'authenticate'],
                        adjectives: ['asynchronous', 'synchronous', 'recursive', 'iterative', 'polymorphic', 'object-oriented', 'functional', 'declarative', 'imperative', 'scalable']
                    },
                    philosophy: {
                        nouns: ['consciousness', 'existence', 'reality', 'truth', 'knowledge', 'wisdom', 'ethics', 'morality', 'justice', 'freedom', 'determinism', 'epistemology', 'metaphysics', 'phenomenology', 'existentialism'],
                        verbs: ['contemplate', 'philosophize', 'rationalize', 'conceptualize', 'theorize', 'postulate', 'deliberate', 'introspect', 'critique', 'deconstruct'],
                        adjectives: ['philosophical', 'metaphysical', 'epistemological', 'existential', 'phenomenological', 'dialectical', 'transcendental', 'empirical', 'rational', 'intuitive']
                    }
                },
                patterns: [
                    'Advanced {noun} {verb} complex {adjective} {noun} systematically.',
                    'Contemporary {adjective} {noun} {verb} traditional paradigms significantly.',
                    'Researchers {verb} {adjective} {noun} through {adjective} methodologies.',
                    'Sophisticated {noun} {verb} {adjective} {noun} with unprecedented precision.',
                    'Multidisciplinary {noun} {verb} {adjective} approaches to {verb} {noun}.',
                    'Theoretical {adjective} {noun} {verb} practical {adjective} applications.',
                    'Computational {noun} {verb} {adjective} {noun} using {adjective} algorithms.',
                    'Philosophical {noun} {verb} fundamental questions about {adjective} {noun}.'
                ]
            }
        };

        // Sentence connectors for more natural flow
        this.connectors = {
            simple: ['and', 'but', 'or', 'so'],
            medium: ['however', 'therefore', 'moreover', 'furthermore', 'although', 'while', 'since'],
            complex: ['nevertheless', 'consequently', 'simultaneously', 'alternatively', 'specifically', 'ultimately']
        };

        // Punctuation patterns by difficulty
        this.punctuationPatterns = {
            easy: ['.', '!', '?', '.', '.'],
            medium: ['.', '!', '?', ';', ':', '.', '.'],
            hard: ['.', '!', '?', ';', ':', '...', '—', '.', '.']
        };
    }

    generateText(difficulty = 'medium', length = 'medium') {
        // Use enhanced generation with fallback to original system
        try {
            return this.generateEnhancedText(difficulty, length);
        } catch (error) {
            console.log('Falling back to original generation method');
            return this.generateOriginalText(difficulty, length);
        }
    }

    generateEnhancedText(difficulty, length) {
        const lengthConfig = {
            short: { sentences: 2, wordsPerSentence: [4, 8] },
            medium: { sentences: 4, wordsPerSentence: [6, 12] },
            long: { sentences: 6, wordsPerSentence: [8, 15] }
        };

        const config = lengthConfig[length] || lengthConfig.medium;
        const database = this.enhancedDatabase[difficulty];
        
        if (!database) {
            throw new Error(`No enhanced database for difficulty: ${difficulty}`);
        }

        let text = '';
        const usedPatterns = new Set(); // Avoid repetitive patterns

        for (let i = 0; i < config.sentences; i++) {
            // Select a random theme for variety
            const themes = Object.keys(database.themes);
            const selectedTheme = this.randomChoice(themes);
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
        // Select an unused pattern or reset if all used
        if (usedPatterns.size >= database.patterns.length) {
            usedPatterns.clear();
        }

        let pattern;
        do {
            pattern = this.randomChoice(database.patterns);
        } while (usedPatterns.has(pattern));
        
        usedPatterns.add(pattern);

        // Replace placeholders with actual words
        let sentence = pattern;
        
        // Replace {noun} placeholders
        sentence = sentence.replace(/{noun}/g, () => {
            return this.randomChoice(themeData.nouns || []);
        });

        // Replace {verb} placeholders
        sentence = sentence.replace(/{verb}/g, () => {
            return this.randomChoice(themeData.verbs || []);
        });

        // Replace {adjective} placeholders
        sentence = sentence.replace(/{adjective}/g, () => {
            return this.randomChoice(themeData.adjectives || []);
        });

        // Replace {adverb} placeholders (generate from adjectives)
        sentence = sentence.replace(/{adverb}/g, () => {
            const adjective = this.randomChoice(themeData.adjectives || ['quickly']);
            return this.adjectiveToAdverb(adjective);
        });

        return sentence;
    }

    adjectiveToAdverb(adjective) {
        // Simple adverb conversion rules
        if (adjective.endsWith('y')) {
            return adjective.slice(0, -1) + 'ily';
        } else if (adjective.endsWith('le')) {
            return adjective.slice(0, -2) + 'ly';
        } else {
            return adjective + 'ly';
        }
    }

    // ORIGINAL GENERATION METHOD - Preserved for backward compatibility
    generateOriginalText(difficulty, length) {
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