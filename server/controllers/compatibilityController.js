const axios = require('axios');
const CompatibilityScore = require('../models/CompatibilityScore');
const Listing = require('../models/Listing');
const TenantProfile = require('../models/TenantProfile');
const calculateFallbackScore = require('../utils/compatibilityFallback');

const getCompatibilityScore = async (req, res) => {
  try {
    const { listingId } = req.params;
    const tenantId = req.user._id;

    // Return cached score if it already exists — do not recompute
    const existing = await CompatibilityScore.findOne({ tenant: tenantId, listing: listingId });
    if (existing) return res.json(existing);

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const tenantProfile = await TenantProfile.findOne({ tenant: tenantId });
    if (!tenantProfile) {
      return res.status(400).json({ message: 'Please create your tenant profile before viewing compatibility scores' });
    }

    let score, explanation, method;

    // Try LLM (Groq) first
    try {
      const prompt = `Given this room listing: ${JSON.stringify({
        location: listing.location,
        rent: listing.rent,
        roomType: listing.roomType,
        furnishing: listing.furnishing
      })} and this tenant profile: ${JSON.stringify({
        preferredLocation: tenantProfile.preferredLocation,
        budgetMin: tenantProfile.budgetMin,
        budgetMax: tenantProfile.budgetMax,
        roomType: tenantProfile.roomType,
        furnishing: tenantProfile.furnishing
      })}, compute a compatibility score from 0 to 100 based on budget and location match. Return JSON: { "score": number, "explanation": string }`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      score = result.score;
      explanation = result.explanation;
      method = 'ai';
    } catch (llmError) {
      // Graceful fallback to rule-based scoring
      console.error('LLM unavailable, using rule-based fallback:', llmError.message);
      const fallback = calculateFallbackScore(listing, tenantProfile);
      score = fallback.score;
      explanation = fallback.explanation;
      method = 'fallback';
    }

    const compatibilityScore = await CompatibilityScore.create({
      tenant: tenantId,
      listing: listingId,
      score,
      explanation,
      method
    });

    res.json(compatibilityScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCompatibilityScore };