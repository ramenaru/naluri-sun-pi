import { sunCircumferenceKm } from './circumference';
import { usePi } from './usePi';

export default function App() {
  const { data, error } = usePi();

  if (!data) {
    return (
      <main>
        <p className="status" role={error ? 'alert' : 'status'}>
          {error ? `Cannot reach the server (${error}). Retrying...` : 'Connecting to the server...'}
        </p>
      </main>
    );
  }

  const circumference = sunCircumferenceKm(data.pi);

  return (
    <main>
      <p className="status" role={error ? 'alert' : 'status'}>
        {error ? `Connection lost (${error}), showing the last value` : `Pi known to ${data.decimals} decimal places`}
      </p>

      <h2>Pi from the server</h2>
      <p className="digits">
        {data.pi.slice(0, -1)}
        <mark>{data.pi.slice(-1)}</mark>
      </p>

      <h2>Circumference of the Sun</h2>
      <p className="digits big">{circumference} km</p>
      <p className="note">2 x pi x 695,700 km (mean solar radius)</p>
    </main>
  );
}
