export type Role = 'frontdesk' | 'housekeeping';

const ROLE_KEY = 'roomready:role';

export const ROLE_LABEL: Record<Role, string> = {
  frontdesk: 'Front Desk',
  housekeeping: 'Housekeeping',
};

export function loadRole(): Role | null {
  const saved = localStorage.getItem(ROLE_KEY);
  return saved === 'frontdesk' || saved === 'housekeeping' ? saved : null;
}

export function saveRole(role: Role): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function clearRole(): void {
  localStorage.removeItem(ROLE_KEY);
}

export function RolePicker({ onPick }: { onPick: (role: Role) => void }) {
  return (
    <div className="screen-center">
      <div className="role-card">
        <h1>RoomReady</h1>
        <p>Who's using this device?</p>
        <button className="role-btn" onClick={() => onPick('frontdesk')}>
          <span className="role-name">Front Desk</span>
          <span className="role-desc">See the status of every room</span>
        </button>
        <button className="role-btn" onClick={() => onPick('housekeeping')}>
          <span className="role-name">Housekeeping</span>
          <span className="role-desc">Tap a room to change its status</span>
        </button>
      </div>
    </div>
  );
}
