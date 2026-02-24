import { X, Calendar, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

function ImgWithFallback({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const fallback =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="20">Image</text></svg>';
  return (
    <img
      src={src || fallback}
      alt={alt || ''}
      className={className}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = fallback;
      }}
    />
  );
}
import type { Court, Player } from '../App';

interface PlayerMatchModalProps {
  court: Court;
  players: Player[];
  onClose: () => void;
}

export function PlayerMatchModal({ court, players, onClose }: PlayerMatchModalProps) {
  if (typeof document === 'undefined') return null;

  const modal = (
    <div
      className="fixed inset-0 flex items-end sm:items-center sm:justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92dvh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-green-500 to-green-600 relative overflow-hidden">
            <ImgWithFallback
              src={court.image}
              alt={court.name}
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 min-h-11 min-w-11 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h2 className="text-white">{court.name}</h2>
            <p className="text-white/90 text-sm">{court.city}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <button className="flex-1 min-h-11 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
              I'm Playing Here
            </button>
            <a
              href={court.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-11 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Court
            </a>
          </div>

          {/* Players looking section */}
          <div className="mb-4">
            <h3 className="text-gray-900 mb-3">
              Players Looking for Opponents ({players.length})
            </h3>

            {players.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No players currently looking here.</p>
                <p className="text-sm mt-2">Be the first to say you're playing!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                  >
                    <ImgWithFallback
                      src={player.avatar}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900">{player.name}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{player.level}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{player.preferredTime}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-blue-900 mb-2">How it works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>- Indicate you're playing at this court</li>
              <li>- Connect with other players looking for matches</li>
              <li>- Book your court through the venue's portal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

