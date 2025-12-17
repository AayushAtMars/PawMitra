import * as Location from 'expo-location';

// Request location permissions
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Location permission denied'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Request background location permissions
export const requestBackgroundLocationPermission = async () => {
  try {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Background location permission denied'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting background location permission:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current location
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const permissionResult = await requestLocationPermission();
      if (!permissionResult.success) {
        return { success: false, error: permissionResult.error };
      }
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        coordinates: [location.coords.longitude, location.coords.latitude] // GeoJSON format
      }
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Watch location changes
export const watchLocation = async (callback) => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const permissionResult = await requestLocationPermission();
      if (!permissionResult.success) {
        return null;
      }
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 50, // Update every 50 meters
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          coordinates: [location.coords.longitude, location.coords.latitude]
        });
      }
    );

    return subscription;
  } catch (error) {
    console.error('Error watching location:', error);
    return null;
  }
};

// Reverse geocoding (get address from coordinates)
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    if (addresses.length > 0) {
      const address = addresses[0];
      const formattedAddress = [
        address.name,
        address.street,
        address.city,
        address.region,
        address.postalCode,
        address.country
      ].filter(Boolean).join(', ');

      return {
        success: true,
        address: formattedAddress,
        details: address
      };
    }

    return {
      success: false,
      error: 'No address found'
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
};

// Format distance for display
export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};
