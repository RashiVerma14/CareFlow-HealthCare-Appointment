export default function Message({ type = 'info', children }) {
  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-700',
    success: 'border-green-200 bg-green-50 text-green-700',
    error: 'border-red-200 bg-red-50 text-red-700'
  };

  if (!children) return null;

  return <div className={`rounded-md border px-3 py-2 text-sm ${styles[type]}`}>{children}</div>;
}
