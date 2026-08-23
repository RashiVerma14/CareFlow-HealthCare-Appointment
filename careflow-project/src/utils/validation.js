export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function required(value) {
  return String(value || '').trim().length > 0;
}

export function passwordMessage(password) {
  if (!password) return 'Password is required';
  if (password.length < 8 || password.length > 20) return 'Password must be between 8 and 20 characters';
  return '';
}
