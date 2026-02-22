import React, { useState, useEffect } from 'react';
import './CampsiteFinder.css';

function CampsiteFinder() {
  const [campsites, setCampsites] = useState([
    {
      id: 1,
      name: 'Lakeside Haven',
      location: 'Lake District, UK',
      rating: 4.8,
      dogFriendly: true,
      price: '£25/night',
      amenities: ['WiFi', 'Water', 'Electric', 'Dog Walks'],
      coordinates: { lat: 54.4609, lng: -3.2050 },
      distance: 12.5
    },
    {
      id: 2,
      name: 'Mountain View Retreat',
      location: 'Snowdonia, Wales',
      rating: 4.6,
      dogFriendly: true,
      price: '£20/night',
      amenities: ['Toilet Block', 'Shower', 'Dog Friendly'],
      coordinates: { lat: 53.0679, lng: -3.9154 },
      distance: 45.3
    },
    {
      id: 3,
      name: 'Coastal Dreams',
      location: 'Cornwall, UK',
      rating: 4.9,
      dogFriendly: true,
      price: '£30/night',
      amenities: ['Beach Access', 'WiFi', 'Pet Friendly', 'Showers'],
      coordinates: { lat: 50.4768, lng: -4.7597 },
      distance: 156.8
    },
    {
      id: 4,
      name: 'Forest Campground',
      location: 'New Forest, Hampshire',
      rating: 4.5,
      dogFriendly: true,
      price: '£18/night',
      amenities: ['Walking Trails', 'Toilet Block', 'Dog Walks'],
      coordinates: { lat: 50.8503, lng: -1.5785 },
      distance: 78.2
    },
    {
      id: 5,
      name: 'Peak District Adventure',
      location: 'Derbyshire, UK',
      rating: 4.7,
      dogFriendly: true,
      price: '£22/night',
      amenities: ['Hiking', 'WiFi', 'Electric Hook-up', 'Dog Friendly'],
      coordinates: { lat: 53.3822, lng: -1.8633 },
      distance: 34.1
    },
  ]);

  const [filteredCampsites, setFilteredCampsites] = useState(campsites);
  const [sortBy, setSortBy] = useState('distance');
  const [filterDogFriendly, setFilterDogFriendly] = useState(true);
  const [selectedCampsite, setSelectedCampsite] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 52.6302, lng: -1.1387 }); // Default UK center

  // Filter and sort campsites
  useEffect(() => {
    let filtered = campsites;
    
    if (filterDogFriendly) {
      filtered = filtered.filter(c => c.dogFriendly);
    }

    let sorted = [...filtered];
    if (sortBy === 'distance') {
      sorted.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    }

    setFilteredCampsites(sorted);
  }, [sortBy, filterDogFriendly, campsites]);

  const handleGetDirections = (campsite) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${campsite.coordinates.lat},${campsite.coordinates.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const handleSaveCampsite = (campsite) => {
    alert(`📍 Saved: ${campsite.name}\n${campsite.location}`);
  };

  return (
    <div className="campsite-finder">
      <div className="finder-header">
        <h2>🏕️ Dog-Friendly Campsite Finder</h2>
        <p>Find perfect spots for you, Bill, Deborah, Minnie & Doris</p>
      </div>

      {/* Controls */}
      <div className="finder-controls">
        <div className="control-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="distance">Closest Distance</option>
            <option value="rating">Highest Rating</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>

        <div className="control-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={filterDogFriendly}
              onChange={(e) => setFilterDogFriendly(e.target.checked)}
            />
            Dog Friendly Only
          </label>
        </div>
      </div>

      {/* Current Location */}
      <div className="location-info">
        <h3>📍 Your Current Location</h3>
        <div className="location-card">
          <p><strong>Latitude:</strong> {userLocation.lat.toFixed(4)}°</p>
          <p><strong>Longitude:</strong> {userLocation.lng.toFixed(4)}°</p>
          <p><strong>Campsites Nearby:</strong> {filteredCampsites.length}</p>
        </div>
      </div>

      {/* Campsites List */}
      <div className="campsites-list">
        <h3>🏕️ Available Campsites</h3>
        {filteredCampsites.length === 0 ? (
          <div className="empty-state">
            <p>No campsites found matching your filters.</p>
          </div>
        ) : (
          <div className="sites-grid">
            {filteredCampsites.map((campsite) => (
              <div
                key={campsite.id}
                className={`campsite-card ${selectedCampsite?.id === campsite.id ? 'selected' : ''}`}
                onClick={() => setSelectedCampsite(campsite)}
              >
                <div className="card-header">
                  <h4>{campsite.name}</h4>
                  <div className="rating">
                    {'⭐'.repeat(Math.floor(campsite.rating))}
                    <span className="rating-value">{campsite.rating}</span>
                  </div>
                </div>

                <div className="card-info">
                  <p><strong>📍</strong> {campsite.location}</p>
                  <p><strong>📏</strong> {campsite.distance} km away</p>
                  <p><strong>💷</strong> {campsite.price}</p>
                  {campsite.dogFriendly && (
                    <p className="dog-friendly">🐾 Dog Friendly!</p>
                  )}
                </div>

                <div className="amenities">
                  <p><strong>Amenities:</strong></p>
                  <div className="amenity-tags">
                    {campsite.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="action-btn directions"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(campsite);
                    }}
                  >
                    🗺️ Directions
                  </button>
                  <button
                    className="action-btn save"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveCampsite(campsite);
                    }}
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="tips-section">
        <h3>💡 Campsite Tips for Dog Owners</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🐾 Before You Go</h4>
            <ul>
              <li>Call ahead to confirm dog policies</li>
              <li>Check for designated dog walking areas</li>
              <li>Verify water/waste facilities</li>
              <li>Ask about nearby vet clinics</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>🌡️ Health & Safety</h4>
            <ul>
              <li>Keep Minnie & Doris hydrated</li>
              <li>Protect from extreme heat/cold</li>
              <li>Check for local wildlife hazards</li>
              <li>Bring first aid supplies</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>🏕️ Campsite Etiquette</h4>
            <ul>
              <li>Keep dogs on leads in communal areas</li>
              <li>Clean up after your pups</li>
              <li>Respect quiet hours</li>
              <li>Be friendly with other campers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Selected Campsite Details */}
      {selectedCampsite && (
        <div className="detail-panel">
          <div className="detail-header">
            <h3>{selectedCampsite.name}</h3>
            <button
              className="close-btn"
              onClick={() => setSelectedCampsite(null)}
            >
              ✕
            </button>
          </div>
          <div className="detail-content">
            <div className="detail-row">
              <strong>Location:</strong>
              <span>{selectedCampsite.location}</span>
            </div>
            <div className="detail-row">
              <strong>Distance:</strong>
              <span>{selectedCampsite.distance} km</span>
            </div>
            <div className="detail-row">
              <strong>Price:</strong>
              <span>{selectedCampsite.price}</span>
            </div>
            <div className="detail-row">
              <strong>Rating:</strong>
              <span>{'⭐'.repeat(Math.floor(selectedCampsite.rating))} {selectedCampsite.rating}/5</span>
            </div>
            <div className="detail-row full">
              <strong>Amenities:</strong>
              <div className="amenity-tags">
                {selectedCampsite.amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
            <div className="detail-actions">
              <button
                className="action-btn directions"
                onClick={() => handleGetDirections(selectedCampsite)}
              >
                🗺️ Get Directions
              </button>
              <button
                className="action-btn save"
                onClick={() => handleSaveCampsite(selectedCampsite)}
              >
                💾 Save to Favorites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampsiteFinder;
