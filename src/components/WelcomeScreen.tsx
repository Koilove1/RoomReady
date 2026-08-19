import { STATUS_ORDER } from '../types';

/**
 * The screen the app opens on. Everything past here is a gate, so this is the
 * one place the app gets to introduce itself. The mark is the three room
 * statuses, which is the whole vocabulary of the board behind it.
 */
export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="welcome">
      <div className="welcome-body">
        <div className="welcome-mark" aria-hidden="true">
          {STATUS_ORDER.map((status) => (
            <span key={status} className={`welcome-dot status-${status}`} />
          ))}
        </div>
        <h1 className="welcome-title">RoomReady</h1>
        <p className="welcome-tagline">Room status, live on every phone.</p>
        <button className="welcome-btn" onClick={onStart}>
          Get Started
        </button>
      </div>
      <footer className="welcome-footer">&copy; 2026 Matthew Banda</footer>
    </div>
  );
}
