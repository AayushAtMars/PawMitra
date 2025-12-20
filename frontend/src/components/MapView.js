import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import theme from '../theme';

// Leaflet imports for web
let L;
if (Platform.OS === 'web') {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
}

/**
 * Production-ready MapView using Leaflet.js
 * Displays incidents, volunteers, and pets on an interactive map
 */
const MapView = ({
  markers = [],
  userLocation = null,
  onMarkerPress,
  style,
  initialRegion = { latitude: 28.7041, longitude: 77.1025, zoom: 12 }, // Default: Delhi
  height = 400,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web' && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [markers, userLocation]);

  const initializeMap = () => {
    try {
      // Fix Leaflet default marker icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [initialRegion.latitude, initialRegion.longitude],
        initialRegion.zoom || 12
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Create markers layer
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

      updateMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateMarkers = () => {
    if (!markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${theme.colors.accent}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(markersLayerRef.current)
        .bindPopup('<b>Your Location</b>');
    }

    // Add other markers
    markers.forEach((marker) => {
      const color = getMarkerColor(marker.type);
      const icon = getMarkerIcon(marker.type);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          ${icon}
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const leafletMarker = L.marker(
        [marker.coordinate.latitude, marker.coordinate.longitude],
        { icon: customIcon }
      ).addTo(markersLayerRef.current);

      // Add popup
      if (marker.title || marker.description) {
        leafletMarker.bindPopup(`
          <div style="min-width: 150px;">
            <b>${marker.title || 'Marker'}</b>
            ${marker.description ? `<p style="margin: 5px 0 0 0; font-size: 12px;">${marker.description}</p>` : ''}
          </div>
        `);
      }

      // Add click handler
      if (onMarkerPress) {
        leafletMarker.on('click', () => onMarkerPress(marker));
      }
    });

    // Fit bounds if markers exist
    if (markers.length > 0 || userLocation) {
      const bounds = [];
      if (userLocation) {
        bounds.push([userLocation.latitude, userLocation.longitude]);
      }
      markers.forEach((m) => {
        bounds.push([m.coordinate.latitude, m.coordinate.longitude]);
      });
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'incident':
        return theme.colors.error;
      case 'volunteer':
        return theme.colors.primary;
      case 'pet':
        return theme.colors.secondary;
      default:
        return theme.colors.gray500;
    }
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'incident':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>';
      case 'volunteer':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
      case 'pet':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M4.5 12.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S2.17 11 3 11s1.5.67 1.5 1.5zm3-4c0 .83-.67 1.5-1.5 1.5S4.5 9.33 4.5 8.5 5.17 7 6 7s1.5.67 1.5 1.5zm4.5 0c0 .83-.67 1.5-1.5 1.5S9 9.33 9 8.5 9.67 7 10.5 7s1.5.67 1.5 1.5zm4.5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S14.67 7 15.5 7s1.5.67 1.5 1.5zm3 4c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-9 5.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/></svg>';
      default:
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
    }
  };

  if (Platform.OS !== 'web') {
    // For native platforms, show message
    return (
      <View style={[styles.container, style, { height }]}>
        <View style={styles.nativeMessage}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill={theme.colors.gray300}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: height,
          borderRadius: theme.borderRadius.lg,
          overflow: 'hidden',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  nativeMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
  },
});

export default MapView;
