import { STATUS_LABEL, STATUS_ORDER } from '../types';
import type { Room, RoomStatus } from '../types';

/** The name is collected once by the name gate, so the sheet only confirms it. */
export function StatusSheet({
  room,
  name,
  onClose,
  onSetStatus,
}: {
  room: Room;
  name: string;
  onClose: () => void;
  onSetStatus: (status: RoomStatus) => void;
}) {
  function pick(status: RoomStatus) {
    onSetStatus(status);
    onClose();
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2>Room {room.name}</h2>
        <p className="sheet-note">Saving as {name}</p>
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
