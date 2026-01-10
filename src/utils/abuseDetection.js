// Simulates an AI Abuse Detection System
export const checkContentSafety = async (text) => {
  // 1. Basic Keyword Filter (The "Rule-based" layer)
  const toxicKeywords = ['hate', 'stupid', 'idiot', 'scam', 'fake'];
  const lowerText = text.toLowerCase();
  
  const hasToxicWord = toxicKeywords.some(word => lowerText.includes(word));

  if (hasToxicWord) {
    return { safe: false, reason: "Contains flagged keywords." };
  }

  // 2. Simulated AI Latency & Probability Check
  // In a real app, this would call OpenAI or TensorFlow.js
  return new Promise((resolve) => {
    setTimeout(() => {
      // Random "AI" check for demonstration
      const aiConfidenceScore = Math.random(); 
      
      if (aiConfidenceScore > 0.95) { 
        // 5% chance of AI false positive for demo purposes
        resolve({ safe: false, reason: "AI detected aggressive tone." });
      } else {
        resolve({ safe: true, reason: "Content looks safe." });
      }
    }, 800);
  });
};