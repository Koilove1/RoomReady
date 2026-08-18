import type { ReactNode } from 'react';
import { STATUS_ORDER, STATUS_LABEL } from '../types';
import type { Room, RoomStatus } from '../types';

export function FloorSection({
  label,
  rooms,
  open,
  onToggle,
  children,
}: {
  label: string;
  rooms: Room[];
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const counts: Record<RoomStatus, number> = { clean: 0, dirty: 0, out_of_order: 0 };
  for (const r of rooms) counts[r.status] += 1;

  return (
    <section className="floor">
      <button className="floor-header" onClick={onToggle} aria-expanded={open}>
        <span className={`floor-caret ${open ? 'open' : ''}`} aria-hidden="true">
          ▸
        </span>
        <span className="floor-label">{label}</span>
        <span className="floor-total">
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
        </span>
        <span className="floor-counts">
          {STATUS_ORDER.filter((s) => counts[s] > 0).map((s) => (
            <span key={s} className={`floor-count status-${s}`} title={STATUS_LABEL[s]}>
              {counts[s]}
            </span>
          ))}
        </span>
      </button>
      {open && <div className="room-grid">{children}</div>}
    </section>
  );
}
