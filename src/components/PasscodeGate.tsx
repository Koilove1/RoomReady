import { useState, type FormEvent } from 'react';

const STORAGE_KEY = 'roomready:unlocked';

export function isUnlocked(): boolean {
  const configured = import.meta.env.VITE_APP_PASSCODE;
  if (!configured) return true;
  return sessionStorage.getItem(STORAGE_KEY) === configured;
}

export function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const configured = import.meta.env.VITE_APP_PASSCODE;
    if (value === configured) {
      sessionStorage.setItem(STORAGE_KEY, value);
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="screen-center">
      <form className="passcode-card" onSubmit={handleSubmit}>
        <h1>RoomReady</h1>
        <p>Enter the staff passcode to continue.</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Passcode"
        />
        {error && <p className="error-text">Incorrect passcode.</p>}
        <button type="submit">Unlock</button>
      </form>
    </div>
  );
}
