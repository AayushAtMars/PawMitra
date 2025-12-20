import * as Location from 'expo-location';

/**
 * Get current user location
 * @returns {Promise<Object>} Location result with success flag and location data
 */
export const getCurrentLocation = async () => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Location permission denied');
      return {
        success: false,
        error: 'Location permission denied',
      };
    }

    // Get current position
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      success: true,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        coordinates: [position.coords.longitude, position.coords.latitude], // GeoJSON format [lng, lat]
      },
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Reverse geocode coordinates to address
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Address result
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (result && result.length > 0) {
      const address = result[0];
      const formattedAddress = [
        address.name,
        address.street,
        address.city,
        address.region,
        address.country,
      ]
        .filter(Boolean)
        .join(', ');

      return {
        success: true,
        address: formattedAddress || 'Address not available',
        details: address,
      };
    }

    return {
      success: false,
      error: 'No address found',
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      success: false,
      error: error.message,
      address: 'Address not available',
    };
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distanceKm Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};
