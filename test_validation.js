// Test the validation logic
function parseQuery(query) {
  const normalized = query.toLowerCase().replace(/\s+/g, ' ').trim();
  const result = { thickness: null, category: null, color: null, useCases: [], features: [] };
  
  const thicknessMatch = normalized.match(/(\d+)\s*mm/);
  if (thicknessMatch) result.thickness = parseInt(thicknessMatch[1]);
  
  const categoryMap = {
    'tempered glass': ['tempered', 'toughened', 'tempered glass'],
    'laminated glass': ['laminated', 'laminated glass'],
    'float glass': ['float', 'float glass'],
    'insulated glass unit': ['insulated', 'double glazed', 'insulated glass unit', 'igu'],
    'mirror': ['mirror', 'mirrors'],
    'aluminium hardware': ['aluminium', 'aluminum', 'hardware', 'aluminium hardware']
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      result.category = category;
      break;
    }
  }
  
  const useCaseMap = {
    'partition': ['partition', 'divider', 'cubicle'],
    'office': ['office', 'commercial', 'workplace'],
    'balcony': ['balcony', 'balconies'],
    'railing': ['railing', 'railings', 'guard', 'barrier'],
    'window': ['window', 'windows', 'glazing'],
    'residential': ['residential', 'home', 'house', 'domestic']
  };
  
  for (const [useCase, keywords] of Object.entries(useCaseMap)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      result.useCases.push(useCase);
    }
  }
  
  const featureMap = {
    'uv': ['uv', 'ultraviolet', 'sun protection'],
    'polished': ['polished', 'smooth', 'finished'],
    'safety': ['safety', 'secure', 'protective'],
    'energy': ['energy', 'efficient', 'thermal'],
    'budget': ['budget', 'cheap', 'affordable', 'economical'],
    'low-e': ['low-e', 'low e', 'emissivity']
  };
  
  for (const [feature, keywords] of Object.entries(featureMap)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      result.features.push(feature);
    }
  }
  
  return result;
}

function isValidQuery(parsedQuery) {
  const hasCategory = parsedQuery.category !== null;
  const hasThickness = parsedQuery.thickness !== null;
  const hasUseCases = parsedQuery.useCases.length > 0;
  const hasFeatures = parsedQuery.features.length > 0;
  
  return hasCategory || hasThickness || hasUseCases || hasFeatures;
}

// Test cases
const testQueries = [
  'hello',
  'glass pls',
  'something cheap',
  'test',
  'tempered glass',
  'glass for balcony',
  'cheap glass',
  '6mm tempered glass',
  'energy efficient windows'
];

console.log('Query Validation Results:');
testQueries.forEach(query => {
  const parsed = parseQuery(query);
  const isValid = isValidQuery(parsed);
  console.log(`"${query}" -> ${isValid ? 'VALID' : 'INVALID'}`);
  if (isValid) {
    console.log(`  Category: ${parsed.category}`);
    console.log(`  Thickness: ${parsed.thickness}`);
    console.log(`  Use Cases: [${parsed.useCases.join(', ')}]`);
    console.log(`  Features: [${parsed.features.join(', ')}]`);
  }
  console.log('');
});
