// gibson-generator.js - Advanced cyberpunk text generator

const vocabulary = require('./gibson-vocabulary');

class GibsonGenerator {
  constructor() {
    this.vocab = vocabulary;
  }

  // Get random item from array
  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Capitalize first letter
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Generate a random sentence using templates
  generateSentence() {
    const template = this.random(this.vocab.templates);
    
    // Replace placeholders in template
    let sentence = template.replace(/{(\w+)}/g, (match, placeholder) => {
      switch (placeholder.toLowerCase()) {
        case 'adjective':
          return this.random(this.vocab.adjectives);
        case 'noun':
          return this.random(this.vocab.nouns);
        case 'nouns':
          return this.random(this.vocab.nouns);
        case 'verb':
          return this.random(this.vocab.verbs);
        case 'corporation':
          return this.random(this.vocab.corporations);
        case 'corporations':
          return this.random(this.vocab.corporations);
        case 'location':
          return this.random(this.vocab.locations);
        case 'locations':
          return this.random(this.vocab.locations);
        case 'phrase':
          return this.random(this.vocab.phrases);
        default:
          // If placeholder doesn't match, try the category directly
          if (this.vocab[placeholder.toLowerCase()]) {
            return this.random(this.vocab[placeholder.toLowerCase()]);
          }
          return placeholder; // Return as-is if no match
      }
    });

    return this.capitalize(sentence);
  }

  // Generate a complex sentence with multiple clauses
  generateComplexSentence() {
    const patterns = [
      // Pattern 1: Main clause + subordinate clause
      () => {
        const main = this.generateSentence().replace('.', '');
        const transition = this.random(['while', 'as', 'when', 'because', 'since']);
        const sub = this.generateSentence().replace('.', '').toLowerCase();
        return `${main} ${transition} ${sub}.`;
      },
      
      // Pattern 2: Phrase + main sentence
      () => {
        const phrase = this.random(this.vocab.phrases);
        const adjective = this.random(this.vocab.adjectives);
        const sentence = this.generateSentence().replace('.', '').toLowerCase();
        return `Through ${adjective} ${phrase}, ${sentence}.`;
      },
      
      // Pattern 3: Two connected clauses
      () => {
        const clause1 = this.generateSentence().replace('.', '');
        const connector = this.random([', and', ', but', ', yet', '; however,', '; meanwhile,']);
        const clause2 = this.generateSentence().replace('.', '').toLowerCase();
        return `${clause1}${connector} ${clause2}.`;
      }
    ];

    const pattern = this.random(patterns);
    return pattern();
  }

  // Generate a paragraph with 3-5 sentences
  generateParagraph() {
    const sentenceCount = 3 + Math.floor(Math.random() * 3); // 3-5 sentences
    const sentences = [];

    for (let i = 0; i < sentenceCount; i++) {
      if (i === 0 || Math.random() > 0.6) {
        // First sentence or 40% chance: use complex sentence
        sentences.push(this.generateComplexSentence());
      } else {
        // Use simple sentence
        sentences.push(this.generateSentence());
      }

      // 30% chance to add a transition at the start of subsequent sentences
      if (i > 0 && Math.random() > 0.7) {
        const transition = this.random(this.vocab.transitions);
        const lastSentence = sentences[sentences.length - 1];
        sentences[sentences.length - 1] = `${transition}, ${lastSentence.charAt(0).toLowerCase()}${lastSentence.slice(1)}`;
      }
    }

    return sentences.join(' ');
  }

  // Generate multiple paragraphs
  generateText(paragraphCount = 4) {
    const paragraphs = [];
    
    for (let i = 0; i < paragraphCount; i++) {
      paragraphs.push(this.generateParagraph());
    }

    return paragraphs;
  }

  // Generate text with thematic coherence
  generateThematicText(theme = null, paragraphCount = 4) {
    // Optional: bias vocabulary toward a specific theme
    const themes = {
      'corporate': {
        adjectives: ['corporate', 'synthetic', 'artificial', 'processed'],
        nouns: ['data', 'algorithm', 'protocol', 'system'],
        verbs: ['process', 'analyze', 'compile', 'execute'],
        bias: 0.7 // 70% chance to use theme words
      },
      'underground': {
        adjectives: ['dark', 'shadow', 'underground', 'black'],
        nouns: ['hack', 'exploit', 'virus', 'backdoor'],
        verbs: ['hack', 'crack', 'breach', 'infiltrate'],
        bias: 0.7
      },
      'neural': {
        adjectives: ['neural', 'quantum', 'synthetic', 'artificial'],
        nouns: ['consciousness', 'memory', 'interface', 'network'],
        verbs: ['sync', 'connect', 'link', 'process'],
        bias: 0.7
      }
    };

    if (theme && themes[theme]) {
      // Temporarily modify vocabulary for thematic generation
      const originalVocab = { ...this.vocab };
      const themeData = themes[theme];
      
      // Bias vocabulary toward theme
      Object.keys(themeData).forEach(key => {
        if (key !== 'bias' && this.vocab[key]) {
          this.vocab[key] = [
            ...themeData[key],
            ...this.vocab[key].filter(word => Math.random() > themeData.bias)
          ];
        }
      });

      const result = this.generateText(paragraphCount);
      
      // Restore original vocabulary
      this.vocab = originalVocab;
      
      return result;
    }

    return this.generateText(paragraphCount);
  }
}

module.exports = GibsonGenerator;