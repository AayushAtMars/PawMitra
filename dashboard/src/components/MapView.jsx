import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ incidents = [], height = 400 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
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
  }, [incidents]);

  const initializeMap = () => {
    try {
      // Fix Leaflet default marker icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map centered on Delhi
      mapInstanceRef.current = L.map(mapRef.current).setView([28.7041, 77.1025], 12);

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

    // Add incident markers
    incidents.forEach((incident) => {
      if (incident.location?.coordinates) {
        const [lng, lat] = incident.location.coordinates;
        const color = getPriorityColor(incident.priority);

        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/>
            </svg>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayerRef.current);

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <b>${incident.animalType || 'Animal'} in distress</b>
            <p style="margin: 5px 0; font-size: 12px;">
              <strong>Priority:</strong> ${incident.priority || 'N/A'}<br/>
              <strong>Status:</strong> ${incident.status || 'N/A'}<br/>
              <strong>Location:</strong> ${incident.address || 'Unknown'}
            </p>
          </div>
        `);
      }
    });

    // Fit bounds if markers exist
    if (incidents.length > 0) {
      const bounds = incidents
        .filter(i => i.location?.coordinates)
        .map(i => [i.location.coordinates[1], i.location.coordinates[0]]);
      
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  return (
    <div
      ref={mapRef}
      style={{ height: `${height}px`, borderRadius: '0.5rem' }}
      className="w-full"
    />
  );
};

export default MapView;
