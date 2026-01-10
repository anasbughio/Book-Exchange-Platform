// src/utils/aiValuation.js

export const calculateBookValue = (title, author, condition) => {
  let points = 0;

  // 1. BASE VALUE (Based on Condition) [cite: 23]
  switch (condition) {
    case 'New': points = 50; break;
    case 'Good': points = 35; break;
    case 'Fair': points = 20; break;
    case 'Poor': points = 10; break;
    default: points = 10;
  }

  // 2. DEMAND FACTOR (Based on Popular Authors) [cite: 24]
  const popularAuthors = ['rowling', 'tolkien', 'king', 'martin', 'colleen hoover', 'sarah j. maas'];
  const lowerAuthor = author.toLowerCase();
  
  if (popularAuthors.some(name => lowerAuthor.includes(name))) {
    points += 15; // +15 points for high demand authors
  }

  // 3. RARITY FACTOR (Based on Keywords) [cite: 25]
  const rareKeywords = ['edition', 'signed', 'hardcover', 'limited', 'collection', 'box set'];
  const lowerTitle = title.toLowerCase();

  if (rareKeywords.some(word => lowerTitle.includes(word))) {
    points += 20; // +20 points for special editions
  }

  // 4. AI VARIANCE (To make it feel organic)
  // Adds a random number between -2 and +5
  const variance = Math.floor(Math.random() * 8) - 2;
  
  return points + variance;
};