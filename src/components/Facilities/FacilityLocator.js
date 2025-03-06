import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './FacilityLocator.css';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FacilityLocator = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default NYC coordinates
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockFacilities = [
      { id: 1, name: 'Main Library', category: 'academic', description: 'Central campus library with study spaces and resources', location: [40.7135, -74.0046], hours: '8AM - 11PM' },
      { id: 2, name: 'Student Center', category: 'services', description: 'Student services and social spaces', location: [40.7140, -74.0065], hours: '7AM - 10PM' },
      { id: 3, name: 'Science Building', category: 'academic', description: 'Houses science labs and classrooms', location: [40.7118, -74.0070], hours: '7AM - 9PM' },
      { id: 4, name: 'University Gym', category: 'athletics', description: 'Fitness center and sports facilities', location: [40.7150, -74.0055], hours: '6AM - 10PM' },
      { id: 5, name: 'Arts Center', category: 'academic', description: 'Theaters, galleries, and art studios', location: [40.7125, -74.0080], hours: '9AM - 8PM' },
      { id: 6, name: 'Dining Hall', category: 'dining', description: 'Main campus dining facility', location: [40.7145, -74.0050], hours: '7AM - 9PM' },
      { id: 7, name: 'Health Center', category: 'services', description: 'Student health services', location: [40.7130, -74.0075], hours: '8AM - 6PM' },
      { id: 8, name: 'Engineering Building', category: 'academic', description: 'Engineering labs and classrooms', location: [40.7120, -74.0060], hours: '7AM - 10PM' },
    ];
    setFacilities(mockFacilities);
  }, []);

  const filteredFacilities = facilities.filter(facility => {
    const matchesCategory = selectedCategory === 'all' || facility.category === selectedCategory;
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { value: 'all', label: 'All Facilities' },
    { value: 'academic', label: 'Academic Buildings' },
    { value: 'services', label: 'Student Services' },
    { value: 'athletics', label: 'Athletic Facilities' },
    { value: 'dining', label: 'Dining' }
  ];

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setMapCenter(facility.location);
  };

  return (
    <div className="facility-locator">
      <div className="facility-header">
        <h1>Campus Facility Locator</h1>
        <p>Find and explore facilities across campus</p>
      </div>

      <div className="facility-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="facility-content">
        <div className="facility-list">
          <h2>Available Facilities</h2>
          {filteredFacilities.length === 0 ? (
            <p className="no-results">No facilities match your search.</p>
          ) : (
            <ul>
              {filteredFacilities.map(facility => (
                <li 
                  key={facility.id} 
                  className={`facility-item ${selectedFacility && selectedFacility.id === facility.id ? 'selected' : ''}`}
                  onClick={() => handleFacilityClick(facility)}
                >
                  <h3>{facility.name}</h3>
                  <p className="facility-category">{facility.category.charAt(0).toUpperCase() + facility.category.slice(1)}</p>
                  <p>{facility.description}</p>
                  <p className="facility-hours"><strong>Hours:</strong> {facility.hours}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="facility-map">
          <MapContainer 
            center={mapCenter} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            whenCreated={mapInstance => {
              mapInstance.on('click', () => {
                setSelectedFacility(null);
              });
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredFacilities.map(facility => (
              <Marker 
                key={facility.id} 
                position={facility.location}
                eventHandlers={{
                  click: () => {
                    setSelectedFacility(facility);
                  },
                }}
              >
                <Popup>
                  <div>
                    <h3>{facility.name}</h3>
                    <p>{facility.description}</p>
                    <p><strong>Hours:</strong> {facility.hours}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selectedFacility && (
        <div className="facility-details">
          <h2>{selectedFacility.name}</h2>
          <p className="facility-category">{selectedFacility.category.charAt(0).toUpperCase() + selectedFacility.category.slice(1)}</p>
          <p>{selectedFacility.description}</p>
          <p><strong>Hours:</strong> {selectedFacility.hours}</p>
          <button onClick={() => setSelectedFacility(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default FacilityLocator;