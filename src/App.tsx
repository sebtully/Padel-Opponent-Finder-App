import { useMemo, useState } from 'react';
import { Search, List, Map as MapIcon } from 'lucide-react';
import { MapView } from './components/MapView';
import { CourtCard } from './components/CourtCard';
import { PlayerMatchModal } from './components/PlayerMatchModal';

export interface Court {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  courts: number;
  bookingUrl: string;
  activePlayers: number;
  image: string;
}

export interface Player {
  id: string;
  name: string;
  level: string;
  courtId: string;
  preferredTime: string;
  avatar: string;
}

// Mock data for padel courts in Denmark
const courts: Court[] = [
  {
    id: '1',
    name: 'Copenhagen Padel Club',
    address: 'Kattegatvej 6, 2150 København Ø',
    city: 'Copenhagen',
    lat: 55.718133691218185,
    lng: 12.607227184305493,
    courts: 6,
    bookingUrl: 'https://www.propadel.dk/newlook/proc_baner.asp',
    activePlayers: 8,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Aarhus Pakhus77',
    address: 'Hveensvej 5, 8000 Aarhus Ø',
    city: 'Aarhus',
    lat: 56.16221514898522,
    lng: 10.222711991489575,
    courts: 4,
    bookingUrl: 'https://pakhus77.dk/booking/',
    activePlayers: 5,
    image: 'https://images.unsplash.com/photo-1622279457486-62e75e84d1ca?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Odense City Padel',
    address: 'Thriges Pl. 9, 5000 Odense C',
    city: 'Odense',
    lat: 55.404582638615494,
    lng: 10.390464253603128,
    courts: 5,
    bookingUrl: 'https://www.matchi.se/facilities/odensecitypadel',
    activePlayers: 12,
    image: 'https://images.unsplash.com/photo-1617883861744-87930cb78f79?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Match Padel Aalborg',
    address: 'Østeraagade 11',
    city: 'Aalborg',
    lat: 57.00732533922712,
    lng: 9.870636152808071,
    courts: 3,
    bookingUrl: 'https://matchpadel.halbooking.dk/newlook/default.asp',
    activePlayers: 6,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Roskilde Padel',
    address: 'Rønøs Alle 2, 4000 Roskilde',
    city: 'Roskilde',
    lat: 55.624088488847725,
    lng: 12.091715969058704,
    courts: 4,
    bookingUrl: 'https://racketclub.dk/book',
    activePlayers: 7,
    image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Esbjerg Padel Center',
    address: 'Stormgade 165',
    city: 'Esbjerg',
    lat: 55.4760,
    lng: 8.4520,
    courts: 3,
    bookingUrl: 'https://example.com/book',
    activePlayers: 4,
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop'
  }
];

const mockPlayers: Player[] = [
  { id: '1', name: 'Anders Nielsen', level: 'Intermediate', courtId: '1', preferredTime: 'Evening', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: '2', name: 'Sophie Hansen', level: 'Advanced', courtId: '1', preferredTime: 'Afternoon', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '3', name: 'Lars Jensen', level: 'Beginner', courtId: '2', preferredTime: 'Morning', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '4', name: 'Emma Petersen', level: 'Intermediate', courtId: '3', preferredTime: 'Evening', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: '5', name: 'Mikkel Andersen', level: 'Advanced', courtId: '3', preferredTime: 'Afternoon', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
];

export default function App() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const courtsWithLiveCounts: Court[] = useMemo(
    () =>
      courts.map((court) => ({
        ...court,
        activePlayers: mockPlayers.filter((player) => player.courtId === court.id).length,
      })),
    []
  );

  const filteredCourts = useMemo(
    () =>
      courtsWithLiveCounts.filter(
        (court) =>
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.city.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [courtsWithLiveCounts, searchQuery]
  );

  const totalCourtCount = useMemo(
    () => courts.reduce((sum, court) => sum + court.courts, 0),
    []
  );

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    setShowPlayerModal(true);
  };

  return (
    <div className="h-screen min-h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-green-600 text-lg">PadelMatch DK</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setView('map')}
                aria-label="Switch to map view"
                className={`min-h-11 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                  view === 'map' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <MapIcon className="w-5 h-5" />
                <span className="text-sm">Map</span>
              </button>
              <button
                onClick={() => setView('list')}
                aria-label="Switch to list view"
                className={`min-h-11 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                  view === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
                <span className="text-sm">List</span>
              </button>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courts or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {view === 'map' ? (
          <MapView 
            courts={filteredCourts} 
            onCourtSelect={handleCourtSelect}
            selectedCourt={selectedCourt}
          />
        ) : (
          <div className="h-full overflow-y-auto pb-24">
            <div className="p-3 sm:p-4 space-y-3">
              {filteredCourts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  players={mockPlayers.filter(p => p.courtId === court.id)}
                  onViewPlayers={() => handleCourtSelect(court)}
                />
              ))}
              {filteredCourts.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
                  No courts found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Player Match Modal */}
      {showPlayerModal && selectedCourt && (
        <PlayerMatchModal
          court={selectedCourt}
          players={mockPlayers.filter(p => p.courtId === selectedCourt.id)}
          onClose={() => {
            setShowPlayerModal(false);
            setSelectedCourt(null);
          }}
        />
      )}

      {/* Bottom Info Bar */}
      <div
        className="bg-white border-t border-gray-200 px-3 py-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="min-w-0">
            <div className="text-green-600">{courts.length}</div>
            <div className="text-gray-500 text-xs">Courts</div>
          </div>
          <div className="min-w-0">
            <div className="text-green-600">{mockPlayers.length}</div>
            <div className="text-gray-500 text-xs">Active Players</div>
          </div>
          <div className="min-w-0">
            <div className="text-green-600">{totalCourtCount}</div>
            <div className="text-gray-500 text-xs">Total Courts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
