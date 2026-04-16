function parseQuery(query) {
    // Normalize input: lowercase and remove extra spaces
    const normalized = query.toLowerCase().replace(/\s+/g, ' ').trim();
    
    const result = {
        thickness: null,
        category: null,
        color: null,
        useCases: [],
        features: []
    };

    // Extract thickness (number followed by mm)
    const thicknessMatch = normalized.match(/(\d+)\s*mm/);
    if (thicknessMatch) {
        result.thickness = parseInt(thicknessMatch[1]);
    }

    // Category mapping with synonyms
    const categoryMap = {
        'tempered glass': ['tempered', 'toughened', 'tempered glass'],
        'laminated glass': ['laminated', 'laminated glass'],
        'float glass': ['float', 'float glass'],
        'insulated glass unit': ['insulated', 'double glazed', 'insulated glass unit', 'igu'],
        'mirror': ['mirror', 'mirrors'],
        'aluminium hardware': ['aluminium', 'aluminum', 'hardware', 'aluminium hardware']
    };

    // Find category
    for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(keyword => normalized.includes(keyword))) {
            result.category = category;
            break;
        }
    }

    // Color mapping
    const colorMap = {
        'clear': ['clear', 'transparent'],
        'bronze': ['bronze', 'brown'],
        'frosted': ['frosted', 'opaque', 'privacy'],
        'tinted': ['tinted', 'colored', 'smoked']
    };

    // Find color
    for (const [color, keywords] of Object.entries(colorMap)) {
        if (keywords.some(keyword => normalized.includes(keyword))) {
            result.color = color;
            break;
        }
    }

    // Use cases mapping
    const useCaseMap = {
        'partition': ['partition', 'divider', 'cubicle'],
        'office': ['office', 'commercial', 'workplace'],
        'balcony': ['balcony', 'balconies'],
        'railing': ['railing', 'railings', 'guard', 'barrier'],
        'window': ['window', 'windows', 'glazing'],
        'residential': ['residential', 'home', 'house', 'domestic']
    };

    // Find use cases
    for (const [useCase, keywords] of Object.entries(useCaseMap)) {
        if (keywords.some(keyword => normalized.includes(keyword))) {
            result.useCases.push(useCase);
        }
    }

    // Features mapping
    const featureMap = {
        'uv': ['uv', 'ultraviolet', 'sun protection'],
        'polished': ['polished', 'smooth', 'finished'],
        'safety': ['safety', 'secure', 'protective'],
        'energy': ['energy', 'efficient', 'thermal'],
        'budget': ['budget', 'cheap', 'affordable', 'economical'],
        'low-e': ['low-e', 'low e', 'emissivity']
    };

    // Find features
    for (const [feature, keywords] of Object.entries(featureMap)) {
        if (keywords.some(keyword => normalized.includes(keyword))) {
            result.features.push(feature);
        }
    }

    return result;
}

function calculateScore(product, parsedQuery) {
    const result = {
        score: 0,
        matchedFields: []
    };

    // Category match (+30)
    if (parsedQuery.category && product.category) {
        if (product.category.toLowerCase() === parsedQuery.category.toLowerCase()) {
            result.score += 30;
            result.matchedFields.push('category');
        } else {
            result.score -= 10; // Wrong category penalty
        }
    }

    // Thickness match
    if (parsedQuery.thickness && product.thickness) {
        if (product.thickness === parsedQuery.thickness) {
            result.score += 25;
            result.matchedFields.push('thickness (exact)');
        } else if (Math.abs(product.thickness - parsedQuery.thickness) <= 2) {
            result.score += 15;
            result.matchedFields.push('thickness (partial)');
        }
    }

    // Use-case/tag match (+25)
    if (parsedQuery.useCases && parsedQuery.useCases.length > 0 && product.tags) {
        const matchedTags = parsedQuery.useCases.filter(useCase => 
            product.tags.some(tag => tag.toLowerCase() === useCase.toLowerCase())
        );
        if (matchedTags.length > 0) {
            result.score += 25;
            result.matchedFields.push(`use-cases: ${matchedTags.join(', ')}`);
        }
    }

    // Feature/color match (+20)
    let featureColorScore = 0;
    const matchedFeatures = [];

    // Check color match
    if (parsedQuery.color && product.color) {
        if (product.color.toLowerCase() === parsedQuery.color.toLowerCase()) {
            featureColorScore += 10;
            matchedFeatures.push('color');
        }
    }

    // Check features match (from description or tags)
    if (parsedQuery.features && parsedQuery.features.length > 0) {
        const allText = `${product.description || ''} ${(product.tags || []).join(' ')}`.toLowerCase();
        const matchedFeatureList = parsedQuery.features.filter(feature => 
            allText.includes(feature.toLowerCase())
        );
        if (matchedFeatureList.length > 0) {
            featureColorScore += 10;
            matchedFeatures.push(`features: ${matchedFeatureList.join(', ')}`);
        }
    }

    if (featureColorScore > 0) {
        result.score += featureColorScore;
        result.matchedFields.push(...matchedFeatures);
    }

    // Normalize score between 0-100
    result.score = Math.max(0, Math.min(100, result.score));

    return result;
}

function matchProducts(query, products) {
    // Parse the query
    const parsedQuery = parseQuery(query);
    
    // Score all products
    const scoredProducts = products.map(product => {
        const scoreResult = calculateScore(product, parsedQuery);
        
        // Generate natural explanation from matchedFields
        let explanation = "";
        const attributes = [];
        
        // Collect matched attributes
        if (scoreResult.matchedFields.includes('category')) {
            attributes.push(product.category);
        }
        
        if (scoreResult.matchedFields.includes('thickness (exact)')) {
            attributes.push(`${product.thickness}mm`);
        } else if (scoreResult.matchedFields.includes('thickness (partial)')) {
            attributes.push(`${product.thickness}mm`);
        }
        
        const useCaseMatch = scoreResult.matchedFields.find(field => field.startsWith('use-cases:'));
        let useCases = null;
        if (useCaseMatch) {
            useCases = useCaseMatch.replace('use-cases: ', '');
        }
        
        const colorMatch = scoreResult.matchedFields.includes('color');
        const featureMatch = scoreResult.matchedFields.find(field => field.startsWith('features:'));
        let features = null;
        if (featureMatch) {
            features = featureMatch.replace('features: ', '');
        }
        
        // Build natural explanation
        if (useCases && attributes.length > 0) {
            if (parsedQuery.features.includes('budget')) {
                explanation = `Budget-friendly ${attributes.join(' ')} perfect for ${useCases}`;
            } else if (features && features.includes('safety')) {
                explanation = `Strong ${attributes.join(' ')} safety glass suitable for ${useCases}`;
            } else if (features && features.includes('energy')) {
                explanation = `Energy-efficient ${attributes.join(' ')} designed for ${useCases}`;
            } else if (features && features.includes('uv')) {
                explanation = `Durable ${attributes.join(' ')} with UV protection ideal for ${useCases}`;
            } else {
                explanation = `Premium ${attributes.join(' ')} ideal for ${useCases}`;
            }
        } else if (attributes.length > 0) {
            explanation = `High-quality ${attributes.join(' ')} for professional applications`;
        } else {
            explanation = `Versatile glass solution for various applications`;
        }
        
        // Add color description
        if (colorMatch && product.color) {
            const colorDesc = product.color === 'clear' ? 'crystal clear' : 
                           product.color === 'frosted' ? 'frosted for privacy' :
                           product.color === 'bronze' ? 'elegant bronze tint' :
                           product.color === 'blue' ? 'decorative blue' :
                           `${product.color} finish`;
            explanation += ` with ${colorDesc}`;
        }
        
        // Add feature details
        if (features) {
            const featureDesc = features.includes('polished') ? 'polished edges for clean finish' :
                              features.includes('low-e') ? 'thermal insulation' :
                              features.includes('acoustic') ? 'sound reduction' :
                              features;
            explanation += `, featuring ${featureDesc}`;
        }
        
        // Add context-specific details
        if (useCases) {
            if (useCases.includes('balcony') || useCases.includes('railing')) {
                explanation += ' for outdoor durability';
            } else if (useCases.includes('office') || useCases.includes('partition')) {
                explanation += ' for modern commercial spaces';
            } else if (useCases.includes('window')) {
                explanation += ' for superior glazing performance';
            } else if (useCases.includes('residential')) {
                explanation += ' perfect for home projects';
            }
        }
        
        explanation += '.';
        
        // Add informative second sentence for lower scores
        if (scoreResult.score < 70) {
            const missingAspects = [];
            
            if (!scoreResult.matchedFields.includes('category')) {
                missingAspects.push('category');
            }
            if (!scoreResult.matchedFields.includes('thickness (exact)') && !scoreResult.matchedFields.includes('thickness (partial)')) {
                missingAspects.push('thickness');
            }
            if (!scoreResult.matchedFields.find(field => field.startsWith('use-cases:'))) {
                missingAspects.push('use case');
            }
            if (!scoreResult.matchedFields.includes('color') && parsedQuery.color) {
                missingAspects.push('color');
            }
            if (!scoreResult.matchedFields.find(field => field.startsWith('features:')) && parsedQuery.features.length > 0) {
                missingAspects.push('features');
            }
            
            if (missingAspects.length > 0) {
                const missingText = missingAspects.length === 1 ? missingAspects[0] : 
                                  missingAspects.length === 2 ? missingAspects.join(' and ') :
                                  `${missingAspects.slice(0, -1).join(', ')}, and ${missingAspects[missingAspects.length - 1]}`;
                
                if (missingAspects.includes('thickness')) {
                    explanation += ` However, thickness differs slightly from requirement.`;
                } else if (missingAspects.includes('category')) {
                    explanation += ` May not fully match the requested category.`;
                } else if (missingAspects.includes('features')) {
                    explanation += ` Lacks some requested features like UV protection.`;
                } else if (missingAspects.includes('color')) {
                    explanation += ` Color finish may not match preference exactly.`;
                } else if (missingAspects.includes('use case')) {
                    explanation += ` May not be optimized for specific application.`;
                } else {
                    explanation += ` Some specifications may differ from requirements.`;
                }
            } else {
                explanation += ` Partial match with some specification differences.`;
            }
        }
        
        return {
            ...product,
            score: scoreResult.score,
            explanation: explanation
        };
    });
    
    // Sort by score (descending)
    scoredProducts.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        
        // Tie-break: if query includes "budget", prioritize lower price
        if (parsedQuery.features.includes('budget')) {
            return (a.price || 0) - (b.price || 0);
        }
        
        return 0;
    });
    
    // Return top 5 results
    return scoredProducts.slice(0, 5);
}

// Example usage and test cases
console.log(parseQuery("I need 6mm toughened glass for office partition"));
console.log(parseQuery("10mm double glazed clear window for home"));
console.log(parseQuery("8mm frosted laminated glass with UV protection for balcony railing"));
console.log(parseQuery("12mm polished tempered glass - cheap option for residential use"));
console.log(parseQuery("6mm clear float glass with low-e coating for energy efficiency"));

// Test calculateScore function
console.log('\n--- Score Calculation Tests ---');

const testProduct = {
    category: 'tempered glass',
    thickness: 6,
    color: 'clear',
    tags: ['office', 'partition', 'safety'],
    description: 'UV protection polished safety glass'
};

const testQuery = parseQuery("I need 6mm toughened glass for office partition with UV protection");
console.log('Product:', testProduct);
console.log('Parsed Query:', testQuery);
console.log('Score Result:', calculateScore(testProduct, testQuery));

// Test matchProducts function
console.log('\n--- Match Products Test ---');

const testProducts = [
    {
        name: 'Tempered Office Glass',
        category: 'tempered glass',
        thickness: 6,
        color: 'clear',
        tags: ['office', 'partition', 'safety'],
        description: 'UV protection polished safety glass',
        price: 120
    },
    {
        name: 'Budget Tempered Glass',
        category: 'tempered glass',
        thickness: 8,
        color: 'clear',
        tags: ['office', 'partition'],
        description: 'Basic tempered glass for partitions',
        price: 80
    },
    {
        name: 'Premium Laminated Glass',
        category: 'laminated glass',
        thickness: 6,
        color: 'frosted',
        tags: ['office', 'privacy'],
        description: 'Frosted laminated glass with UV protection',
        price: 150
    }
];

const matchResults = matchProducts("I need 6mm toughened glass for office partition with UV protection", testProducts);
console.log('Match Results:', matchResults);

const budgetResults = matchProducts("cheap tempered glass for office partition", testProducts);
console.log('Budget Match Results:', budgetResults);
