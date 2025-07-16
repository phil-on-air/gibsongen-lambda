// test-generator.js - Test the Gibsongen generator standalone

const GibsongenGenerator = require('./gibson-generator');

console.log('🤖 Testing Gibsongen Text Generator\n');

const generator = new GibsongenGenerator();

console.log('='.repeat(80));
console.log('📝 GENERATING 4 CYBERPUNK PARAGRAPHS');
console.log('='.repeat(80));

// Generate 4 paragraphs
const paragraphs = generator.generateText(4);

paragraphs.forEach((paragraph, index) => {
  console.log(`\n📖 PARAGRAPH ${index + 1}:`);
  console.log('-'.repeat(60));
  console.log(paragraph);
});

console.log('\n' + '='.repeat(80));
console.log('🎨 THEMATIC VARIATIONS');
console.log('='.repeat(80));

// Test thematic generation
const themes = ['corporate', 'underground', 'neural'];

themes.forEach(theme => {
  console.log(`\n🏷️  ${theme.toUpperCase()} THEME:`);
  console.log('-'.repeat(40));
  const themedParagraph = generator.generateThematicText(theme, 1)[0];
  console.log(themedParagraph);
});

console.log('\n' + '='.repeat(80));
console.log('📊 VOCABULARY STATS');
console.log('='.repeat(80));

const vocab = require('./gibson-vocabulary');

Object.keys(vocab).forEach(category => {
  if (Array.isArray(vocab[category])) {
    console.log(`${category}: ${vocab[category].length} words`);
  }
});

console.log('\n🎉 Generator test completed! Ready for deployment.\n');