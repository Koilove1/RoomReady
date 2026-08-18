export type RoomStatus = 'clean' | 'dirty' | 'out_of_order';

export interface Room {
  id: string;
  name: string;
  status: RoomStatus;
  updatedBy: string | null;
  updatedAt: number | null;
  createdAt: number;
}

export const STATUS_LABEL: Record<RoomStatus, string> = {
  clean: 'Clean',
  dirty: 'Needs Cleaning',
  out_of_order: 'Out of Order',
};

export const STATUS_ORDER: RoomStatus[] = ['dirty', 'out_of_order', 'clean'];

/** The property is a fixed 62 rooms: 101-121, 201-221, 301-320. */
export const ROOM_NUMBERS: string[] = [
  ...Array.from({ length: 21 }, (_, i) => String(101 + i)),
  ...Array.from({ length: 21 }, (_, i) => String(201 + i)),
  ...Array.from({ length: 20 }, (_, i) => String(301 + i)),
];

/** Room numbers are floor-prefixed, so the first digit is the floor. */
export function floorOf(roomName: string): string {
  return roomName.slice(0, 1);
}

export const FLOOR_IDS: string[] = [...new Set(ROOM_NUMBERS.map(floorOf))];

/** Rooms saved before `in_progress` was replaced by `out_of_order`. */
export function normalizeStatus(status: unknown): RoomStatus {
  if (status === 'clean' || status === 'dirty' || status === 'out_of_order') return status;
  return 'dirty';
}
