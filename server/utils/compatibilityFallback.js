const calculateFallbackScore = (listing, tenantProfile) => {
  let score = 0;
  const reasons = [];

  // Budget match — 40 points
  if (listing.rent >= tenantProfile.budgetMin && listing.rent <= tenantProfile.budgetMax) {
    score += 40;
    reasons.push('Rent is within the tenant budget range');
  } else if (listing.rent < tenantProfile.budgetMin) {
    score += 20;
    reasons.push('Rent is below the tenant minimum budget');
  } else {
    const overage = listing.rent - tenantProfile.budgetMax;
    const penalty = Math.min(40, Math.floor((overage / tenantProfile.budgetMax) * 100));
    score += Math.max(0, 40 - penalty);
    reasons.push('Rent exceeds the tenant budget range');
  }

  // Location match — 30 points
  const listingLoc = listing.location.toLowerCase();
  const preferredLoc = tenantProfile.preferredLocation.toLowerCase();
  if (listingLoc.includes(preferredLoc) || preferredLoc.includes(listingLoc)) {
    score += 30;
    reasons.push('Location matches tenant preference');
  } else {
    reasons.push('Location does not match tenant preference');
  }

  // Room type match — 15 points
  if (tenantProfile.roomType === 'any' || listing.roomType === tenantProfile.roomType) {
    score += 15;
    reasons.push('Room type matches tenant preference');
  } else {
    reasons.push('Room type does not match tenant preference');
  }

  // Furnishing match — 15 points
  if (tenantProfile.furnishing === 'any' || listing.furnishing === tenantProfile.furnishing) {
    score += 15;
    reasons.push('Furnishing status matches tenant preference');
  } else {
    reasons.push('Furnishing status does not match tenant preference');
  }

  return { score, explanation: reasons.join('. ') + '.' };
};

module.exports = calculateFallbackScore;