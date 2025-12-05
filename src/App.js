import React, { useState, useMemo } from 'react';
import { Calculator, Leaf, Car, Utensils, Building, TrendingDown, FileText, Copy, Mail, MapPin, Download, Search, ChevronDown, ChevronUp, Info } from 'lucide-react';

const App = () => {
  const [eventData, setEventData] = useState({
    eventName: '',
    attendees: 50,
    duration: 1,
    venue: 'university-lincoln',
    customVenue: { name: '', type: 'medium', hasCertification: false, manualCO2: null },
    catering: 'mixed',
    travel: 'mixed',
    materials: 'standard',
    hybrid: false,
    onlineAttendees: 0
  });

  const [expandedVenue, setExpandedVenue] = useState(null);
  const [venueSearch, setVenueSearch] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    { name: 'Networking Breakfast', attendees: 30, duration: 0.25, venue: 'university-lincoln', catering: 'plantBased', icon: '☕' },
    { name: 'Business Forum', attendees: 50, duration: 0.5, venue: 'university-lincoln', catering: 'seasonal', icon: '💼' },
    { name: 'Conference', attendees: 100, duration: 1, venue: 'lincolnshire-showground', catering: 'mixed', icon: '🎤' },
    { name: 'Hybrid Event', attendees: 40, duration: 0.5, venue: 'university-lincoln', catering: 'seasonal', hybrid: true, onlineAttendees: 30, icon: '🌐' }
  ];

  const venues = {
    recommended: [
      { id: 'hill-holt-wood', name: 'Hill Holt Wood', co2: 0.15, cost: 80, location: 'Norton Disney', email: 'info@hillholtwood.co.uk', phone: '01522 123456', features: ['Outdoor setting', 'Minimal energy'], estimate: '5-15 kg' },
      { id: 'barbican', name: 'Barbican Creative', co2: 0.4, cost: 60, location: 'Lincoln Centre', email: 'hello@barbicanlincoln.co.uk', phone: '01522 234567', features: ['Small space', 'Low energy'], estimate: '10-20 kg' }
    ],
    strong: [
      { id: 'university-lincoln', name: 'University of Lincoln (ISO 14001)', co2: 0.6, cost: 75, location: 'Brayford Pool', email: 'events@lincoln.ac.uk', phone: '01522 886644', features: ['ISO 14001', 'Hybrid setup', 'Free parking'], estimate: '15-30 kg', discount: 'Chamber rates available', hybrid: true },
      { id: 'riseholme', name: 'Riseholme Campus', co2: 0.7, cost: 90, location: 'Riseholme', email: 'riseholme@lincoln.ac.uk', phone: '01522 345678', features: ['Large space', 'Ample parking'], estimate: '20-35 kg' }
    ],
    acceptable: [
      { id: 'lincolnshire-showground', name: 'Lincolnshire Showground (EPIC)', co2: 0.9, cost: 200, location: 'Lincoln', email: 'events@lincolnshireshowground.co.uk', phone: '01522 522900', features: ['Large capacity', 'Modern facilities'], estimate: '25-40 kg', hybrid: true },
      { id: 'old-bakery', name: 'The Old Bakery', co2: 0.85, cost: 120, location: 'Lincoln', email: 'bookings@theoldbakerylincoln.co.uk', phone: '01522 456789', features: ['Boutique', 'Character building'], estimate: '25-45 kg' },
      { id: 'commerce-house', name: 'Commerce House (Chamber HQ)', co2: 0.9, cost: 50, location: 'Lincoln', email: 'events@lincs-chamber.co.uk', phone: '01522 523333', features: ['Chamber HQ', 'Central'], estimate: '25-45 kg', discount: 'Free for members', hybrid: true }
    ],
    consider: [
      { id: 'washingborough', name: 'Washingborough Hall Hotel', co2: 1.1, cost: 250, location: 'Washingborough', email: 'events@washingborough.com', phone: '01522 790340', features: ['Hotel', 'Restaurant'], estimate: '30-55 kg' },
      { id: 'clay-hall', name: 'Clay Hill Hotel', co2: 1.0, cost: 230, location: 'Lincoln', email: 'info@clayhillhotel.co.uk', phone: '01522 567890', features: ['Hotel', 'Conference'], estimate: '35-60 kg' },
      { id: 'brackenborough', name: 'Brackenborough Lakes Resort', co2: 1.3, cost: 300, location: 'Louth', email: 'events@brackenborough.co.uk', phone: '01507 678901', features: ['Resort', 'Spa', 'Golf'], estimate: '40-65 kg' }
    ],
    offset: [
      { id: 'doubletree', name: 'DoubleTree by Hilton', co2: 1.5, cost: 400, location: 'Lincoln Brayford', email: 'events.lincoln@hilton.com', phone: '01522 544244', features: ['International brand', 'Full service'], estimate: '45-75 kg', hybrid: true },
      { id: 'harlaxon', name: 'Harlaxon Manor', co2: 2.0, cost: 500, location: 'Harlaxton', email: 'events@harlaxtonmanor.com', phone: '01476 789012', features: ['Historic manor', 'Luxury'], estimate: '60-100+ kg' },
      { id: 'sessions', name: 'Sessions House', co2: 1.8, cost: 350, location: 'Spalding', email: 'info@sessionshouse.co.uk', phone: '01775 890123', features: ['Historic', 'Large halls'], estimate: '60-90 kg' }
    ]
  };

  const emissionFactors = {
    catering: { meat: 5.3, mixed: 3.2, plantBased: 1.4, seasonal: 0.9 },
    travel: { car: 0.17, carpool: 0.06, bus: 0.03, train: 0.04, mixed: 0.12 },
    materials: { standard: 1.5, reduced: 0.8, digital: 0.2 }
  };

  const costEstimates = {
    catering: { meat: 12, mixed: 10, plantBased: 6.5, seasonal: 5.5 },
    materials: { standard: 8, reduced: 5, digital: 1 }
  };

  const getCurrentVenue = () => {
    if (eventData.venue === 'custom') {
      const typeMultipliers = { small: 0.5, medium: 0.9, large: 1.4 };
      const certDiscount = eventData.customVenue.hasCertification ? 0.7 : 1;
      return {
        id: 'custom',
        name: eventData.customVenue.name || 'Custom Venue',
        co2: eventData.customVenue.manualCO2 || (typeMultipliers[eventData.customVenue.type] * certDiscount),
        cost: 150
      };
    }
    for (const tier of Object.values(venues)) {
      const venue = tier.find(v => v.id === eventData.venue);
      if (venue) return venue;
    }
    return venues.strong[0];
  };

  const calculations = useMemo(() => {
    const inPerson = eventData.attendees;
    const total = inPerson + (eventData.hybrid ? eventData.onlineAttendees : 0);
    const venue = getCurrentVenue();
    
    const venueEmissions = inPerson * venue.co2 * eventData.duration * 8;
    const cateringEmissions = inPerson * emissionFactors.catering[eventData.catering];
    const travelEmissions = inPerson * 35 * emissionFactors.travel[eventData.travel];
    const materialEmissions = inPerson * emissionFactors.materials[eventData.materials];
    const onlineEmissions = eventData.hybrid ? eventData.onlineAttendees * 0.1 : 0;
    const totalEmissions = venueEmissions + cateringEmissions + travelEmissions + materialEmissions + onlineEmissions;

    const venueCost = venue.cost * eventData.duration;
    const cateringCost = inPerson * costEstimates.catering[eventData.catering];
    const materialCost = inPerson * costEstimates.materials[eventData.materials];
    const totalCost = venueCost + cateringCost + materialCost;

    const convVenue = venues.offset[0];
    const convEmissions = inPerson * (convVenue.co2 * eventData.duration * 8 + emissionFactors.catering.meat + 35 * emissionFactors.travel.mixed + emissionFactors.materials.standard);
    const convCost = convVenue.cost * eventData.duration + inPerson * costEstimates.catering.meat + inPerson * costEstimates.materials.standard;

    const saved = convEmissions - totalEmissions;
    const costSaved = convCost - totalCost;
    const reduction = convEmissions > 0 ? (saved / convEmissions * 100).toFixed(1) : 0;

    return {
      venueEmissions: venueEmissions.toFixed(1),
      cateringEmissions: cateringEmissions.toFixed(1),
      travelEmissions: travelEmissions.toFixed(1),
      materialEmissions: materialEmissions.toFixed(1),
      onlineEmissions: onlineEmissions.toFixed(1),
      totalEmissions: totalEmissions.toFixed(1),
      totalCost: totalCost.toFixed(0),
      venueCost: venueCost.toFixed(0),
      cateringCost: cateringCost.toFixed(0),
      materialCost: materialCost.toFixed(0),
      emissionsSaved: saved.toFixed(1),
      costSaved: costSaved.toFixed(0),
      reduction,
      offsetCost: (totalEmissions / 1000 * 15).toFixed(2),
      trees: Math.round(totalEmissions / 22),
      total,
      inPerson
    };
  }, [eventData]);

  const loadTemplate = (t) => {
    setEventData(prev => ({
      ...prev,
      eventName: t.name + ' Template',
      attendees: t.attendees,
      duration: t.duration,
      venue: t.venue,
      catering: t.catering,
      hybrid: t.hybrid || false,
      onlineAttendees: t.onlineAttendees || 0
    }));
    setShowTemplates(false);
  };

  const generatePDF = () => {
    const venue = getCurrentVenue();
    const date = new Date().toLocaleDateString('en-GB');
    
    const content = `LINCOLNSHIRE CHAMBER OF COMMERCE
EVENT SUSTAINABILITY REPORT
Generated: ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EVENT DETAILS
${eventData.eventName || 'Untitled Event'}
Attendees: ${eventData.attendees} in-person${eventData.hybrid ? ` + ${eventData.onlineAttendees} online` : ''}
Duration: ${eventData.duration} day(s)
Venue: ${venue.name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CARBON FOOTPRINT
Venue Energy:     ${calculations.venueEmissions} kg CO₂e
Catering:         ${calculations.cateringEmissions} kg CO₂e
Travel:           ${calculations.travelEmissions} kg CO₂e
Materials:        ${calculations.materialEmissions} kg CO₂e
${eventData.hybrid ? `Online:           ${calculations.onlineEmissions} kg CO₂e` : ''}

TOTAL:            ${calculations.totalEmissions} kg CO₂e
Per Person:       ${(calculations.totalEmissions / calculations.total).toFixed(1)} kg CO₂e
Tree Equivalent:  ${calculations.trees} trees

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COST BREAKDOWN
Venue:            £${calculations.venueCost}
Catering:         £${calculations.cateringCost}
Materials:        £${calculations.materialCost}

TOTAL:            £${calculations.totalCost}
Per Person:       £${(calculations.totalCost / calculations.inPerson).toFixed(2)}
Carbon Offset:    £${calculations.offsetCost}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPACT vs CONVENTIONAL EVENT
Emissions Reduced: ${calculations.reduction}%
CO₂e Saved:       ${calculations.emissionsSaved} kg
Cost Saved:       £${calculations.costSaved}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VENDOR INFORMATION
Venue: ${venue.name}
${venue.email ? `Email: ${venue.email}` : ''}
${venue.phone ? `Phone: ${venue.phone}` : ''}
${venue.discount ? `Note: ${venue.discount}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calculator: sustainability.lincolnshirechamber.co.uk`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Event_Report_${eventData.eventName || 'Untitled'}_${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredVenues = useMemo(() => {
    if (!venueSearch) return venues;
    const search = venueSearch.toLowerCase();
    const filtered = {};
    Object.keys(venues).forEach(tier => {
      filtered[tier] = venues[tier].filter(v => 
        v.name.toLowerCase().includes(search) || v.location.toLowerCase().includes(search)
      );
    });
    return filtered;
  }, [venueSearch]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Event Sustainability Calculator</h1>
            <p className="text-gray-600">Lincolnshire Chamber of Commerce</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between text-blue-800 font-semibold"
          >
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Quick Start Templates
            </div>
            {showTemplates ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showTemplates && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {templates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => loadTemplate(t)}
                  className="p-3 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{t.attendees} people</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                value={eventData.eventName}
                onChange={(e) => setEventData(prev => ({ ...prev, eventName: e.target.value }))}
                placeholder="e.g., Q1 Business Forum"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">In-Person Attendees</label>
              <input
                type="number"
                value={eventData.attendees}
                onChange={(e) => setEventData(prev => ({ ...prev, attendees: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
              <input
                type="number"
                step="0.25"
                value={eventData.duration}
                onChange={(e) => setEventData(prev => ({ ...prev, duration: parseFloat(e.target.value) || 1 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="0.25"
              />
              <p className="text-xs text-gray-500 mt-1">0.25 = 2 hours, 0.5 = half day</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Venue</label>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={venueSearch}
                  onChange={(e) => setVenueSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <select
                value={eventData.venue}
                onChange={(e) => setEventData(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <optgroup label="⭐ Recommended (5-20 kg)">
                  {filteredVenues.recommended?.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - £{v.cost}/day</option>
                  ))}
                </optgroup>
                <optgroup label="✅ Strong Alternative (15-30 kg)">
                  {filteredVenues.strong?.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - £{v.cost}/day</option>
                  ))}
                </optgroup>
                <optgroup label="🟡 Acceptable (25-45 kg)">
                  {filteredVenues.acceptable?.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - £{v.cost}/day</option>
                  ))}
                </optgroup>
                <optgroup label="🟠 Consider Alternatives (30-55 kg)">
                  {filteredVenues.consider?.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - £{v.cost}/day</option>
                  ))}
                </optgroup>
                <optgroup label="🔴 Offset Required (45-100+ kg)">
                  {filteredVenues.offset?.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - £{v.cost}/day</option>
                  ))}
                </optgroup>
                <optgroup label="────────────">
                  <option value="custom">⚙️ Custom Venue</option>
                </optgroup>
              </select>

              {eventData.venue !== 'custom' && (
                <button
                  onClick={() => setExpandedVenue(expandedVenue === eventData.venue ? null : eventData.venue)}
                  className="w-full mt-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  {expandedVenue === eventData.venue ? 'Hide' : 'Show'} Details
                </button>
              )}

              {expandedVenue === eventData.venue && eventData.venue !== 'custom' && (() => {
                const venue = getCurrentVenue();
                return (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3 text-sm">
                    <div><strong>Location:</strong> {venue.location}</div>
                    <div><strong>Features:</strong> {venue.features?.join(', ')}</div>
                    <div><strong>Contact:</strong> {venue.email} | {venue.phone}</div>
                    <div><strong>Estimate:</strong> {venue.estimate}</div>
                    {venue.discount && <div className="text-amber-800">💰 {venue.discount}</div>}
                    <button
                      onClick={() => {
                        window.location.href = `mailto:${venue.email}?subject=Event Enquiry&body=Event: ${eventData.attendees} attendees, ${eventData.duration} day(s)`;
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email Quote
                    </button>
                  </div>
                );
              })()}

              {eventData.venue === 'custom' && (
                <div className="p-4 bg-amber-50 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={eventData.customVenue.name}
                    onChange={(e) => setEventData(prev => ({ ...prev, customVenue: { ...prev.customVenue, name: e.target.value }}))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Venue name"
                  />
                  <select
                    value={eventData.customVenue.type}
                    onChange={(e) => setEventData(prev => ({ ...prev, customVenue: { ...prev.customVenue, type: e.target.value }}))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="small">Small (10-30)</option>
                    <option value="medium">Medium (30-80)</option>
                    <option value="large">Large (80+)</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={eventData.customVenue.hasCertification}
                      onChange={(e) => setEventData(prev => ({ ...prev, customVenue: { ...prev.customVenue, hasCertification: e.target.checked }}))}
                    />
                    Green certified
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catering</label>
              <select
                value={eventData.catering}
                onChange={(e) => setEventData(prev => ({ ...prev, catering: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="meat">Meat-Based (£12/person)</option>
                <option value="mixed">Mixed (£10/person)</option>
                <option value="plantBased">Plant-Based (£6.50/person)</option>
                <option value="seasonal">Seasonal Plant-Based (£5.50/person)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel</label>
              <select
                value={eventData.travel}
                onChange={(e) => setEventData(prev => ({ ...prev, travel: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="car">Private Car</option>
                <option value="mixed">Mixed Transport</option>
                <option value="carpool">Carpool/Shuttle</option>
                <option value="bus">Public Bus</option>
                <option value="train">Train</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materials</label>
              <select
                value={eventData.materials}
                onChange={(e) => setEventData(prev => ({ ...prev, materials: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="standard">Standard Printed (£8/person)</option>
                <option value="reduced">Reduced/Reusable (£5/person)</option>
                <option value="digital">Digital Only (£1/person)</option>
              </select>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={eventData.hybrid}
                onChange={(e) => setEventData(prev => ({ ...prev, hybrid: e.target.checked }))}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Hybrid Event</span>
            </label>

            {eventData.hybrid && (
              <input
                type="number"
                value={eventData.onlineAttendees}
                onChange={(e) => setEventData(prev => ({ ...prev, onlineAttendees: parseInt(e.target.value) || 0 }))}
                placeholder="Online attendees"
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Carbon Footprint</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Venue:</span><span>{calculations.venueEmissions} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Catering:</span><span>{calculations.cateringEmissions} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel:</span><span>{calculations.travelEmissions} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials:</span><span>{calculations.materialEmissions} kg</span>
                </div>
                <div className="pt-3 border-t-2 border-green-300 flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span className="text-xl">{calculations.totalEmissions} kg CO₂e</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Per Person:</span><span>{(calculations.totalEmissions / calculations.total).toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Trees:</span><span>🌳 {calculations.trees}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Cost</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Venue:</span><span>£{calculations.venueCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Catering:</span><span>£{calculations.cateringCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials:</span><span>£{calculations.materialCost}</span>
                </div>
                <div className="pt-3 border-t-2 border-blue-300 flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span className="text-xl">£{calculations.totalCost}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Per Person:</span><span>£{(calculations.totalCost / calculations.inPerson).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 border-2 border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Impact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Reduction:</span>
                  <span className="text-xl font-bold text-green-600">{calculations.reduction}%</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂e Saved:</span><span className="text-green-600">{calculations.emissionsSaved} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Saved:</span><span className="text-green-600">£{calculations.costSaved}</span>
                </div>
              </div>
            </div>

            <button
              onClick={generatePDF}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <Utensils className="w-7 h-7 text-green-600" />
          Recommended Catering Vendors
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Slow-Rise Bakery</h3>
            <p className="text-sm text-gray-600 mb-2">Plant-based, seasonal</p>
            <p className="text-lg font-bold text-green-700 mb-2">£5.50/person</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@slowrisebakery.co.uk" className="hover:underline">hello@slowrisebakery.co.uk</a>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>01522 111222</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Yellowberry</h3>
            <p className="text-sm text-gray-600 mb-2">Seasonal, local ingredients</p>
            <p className="text-lg font-bold text-green-700 mb-2">£6.50/person</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:catering@yellowberry.co.uk" className="hover:underline">catering@yellowberry.co.uk</a>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>01522 222333</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">University of Lincoln</h3>
            <p className="text-sm text-gray-600 mb-2">ISO certified, seasonal</p>
            <p className="text-lg font-bold text-green-700 mb-2">£6.00/person</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:catering@lincoln.ac.uk" className="hover:underline">catering@lincoln.ac.uk</a>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>01522 886000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Leaf className="w-7 h-7 text-green-600" />
          Quick Win Recommendations
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {getCurrentVenue().co2 > 1.0 && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <Building className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Switch to Certified Venue</h3>
                  <p className="text-sm text-green-600 font-medium mb-2">Save ~65 kg CO₂e</p>
                  <p className="text-sm text-gray-600">Consider University of Lincoln (ISO 14001) - £75/day with hybrid capability included.</p>
                </div>
              </div>
            </div>
          )}

          {eventData.catering !== 'seasonal' && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <Utensils className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Adopt Plant-Based Catering</h3>
                  <p className="text-sm text-green-600 font-medium mb-2">Save ~{(eventData.attendees * 3.9).toFixed(0)} kg CO₂e & £{(eventData.attendees * 5.5).toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Partner with Slow-Rise Bakery or Yellowberry. Reduce cost to £5.50/person.</p>
                </div>
              </div>
            </div>
          )}

          {(eventData.travel === 'car' || eventData.travel === 'mixed') && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <Car className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Implement Green Transport</h3>
                  <p className="text-sm text-green-600 font-medium mb-2">Save ~40% travel emissions</p>
                  <p className="text-sm text-gray-600">Use Liftshare app (free) or arrange Stagecoach shuttle for 50+ attendees (£200-£350).</p>
                </div>
              </div>
            </div>
          )}

          {eventData.materials === 'standard' && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Go Digital</h3>
                  <p className="text-sm text-green-600 font-medium mb-2">Save ~{(eventData.attendees * 1.3).toFixed(0)} kg CO₂e & £{(eventData.attendees * 7).toFixed(0)}</p>
                  <p className="text-sm text-gray-600">QR-coded agendas, digital registration, reusable banners (£30-£50 one-time).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Did You Know?</h3>
          <p className="text-sm text-gray-700">
            According to UNEP (2023), travel and logistics make up around 70% of an event's total carbon footprint. 
            VisitScotland (2020) reduced travel emissions by 45% using hybrid meetings, while the Manchester Green 
            Summit (2021) achieved zero waste to landfill through local catering and composting.
          </p>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">ISO 20121 Alignment</h3>
          <p className="text-sm text-gray-700">
            This calculator helps you track key performance indicators (KPIs) aligned with ISO 20121 standards: 
            carbon emissions, waste reduction, and cost efficiency. Consider conducting formal sustainability 
            audits and implementing the Triple Bottom Line framework (People, Planet, Profit) for comprehensive 
            event sustainability management.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Calculator based on UNEP guidelines, UK emission factors, and Lincolnshire Chamber audit findings</p>
        <p className="mt-1">Average travel distance: 35km | Carbon offset: £15/tonne (UK voluntary market rate)</p>
      </div>
    </div>
  );
};

export default App;