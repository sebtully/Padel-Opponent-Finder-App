import { MapPin, Calendar, Users } from 'lucide-react';
import type { Court, Player } from '../App';

interface CourtCardProps {
  court: Court;
  players: Player[];
  onViewPlayers: () => void;
}

export function CourtCard({ court, players, onViewPlayers }: CourtCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="relative h-40">
        <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
        {players.length > 0 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
            {players.length} looking to play
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-gray-900 mb-1">{court.name}</h3>
        
        <div className="flex items-start gap-2 text-gray-600 mb-3 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <div>{court.address}</div>
            <div>{court.city}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{court.courts} courts</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onViewPlayers}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Find Players
          </button>
          <a
            href={court.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Court
          </a>
        </div>
      </div>
    </div>
  );
}
