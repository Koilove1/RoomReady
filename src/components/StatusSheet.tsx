import { useState } from 'react';
import { STATUS_LABEL, STATUS_ORDER } from '../types';
import type { Room, RoomStatus } from '../types';

const NAME_KEY = 'roomready:housekeeperName';

export function StatusSheet({
  room,
  onClose,
  onSetStatus,
}: {
  room: Room;
  onClose: () => void;
  onSetStatus: (status: RoomStatus, name: string) => void;
}) {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '');

  function pick(status: RoomStatus) {
    const trimmed = name.trim() || 'Staff';
    localStorage.setItem(NAME_KEY, trimmed);
    onSetStatus(status, trimmed);
    onClose();
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2>Room {room.name}</h2>
        <label className="field-label" htmlFor="hk-name">
          Your name
        </label>
        <input
          id="hk-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maria"
        />
        <div className="status-options">
          {STATUS_ORDER.map((status) => (
            <button
              key={status}
              className={`status-option status-${status} ${room.status === status ? 'active' : ''}`}
              onClick={() => pick(status)}
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
        <button className="link-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
