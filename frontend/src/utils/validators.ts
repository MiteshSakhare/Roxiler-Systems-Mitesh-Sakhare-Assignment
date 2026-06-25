/** Mirrors the backend password regex */
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  name: (value: string): string | null => {
    if (!value) return 'Name is required';
    if (value.length < 20) return 'Name must be at least 20 characters';
    if (value.length > 60) return 'Name must not exceed 60 characters';
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Please provide a valid email address';
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (!PASSWORD_REGEX.test(value)) {
      return 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }
    return null;
  },

  address: (value: string): string | null => {
    if (value && value.length > 400) return 'Address must not exceed 400 characters';
    return null;
  },

  rating: (value: number): string | null => {
    if (!value) return 'Rating is required';
    if (value < 1 || value > 5) return 'Rating must be between 1 and 5';
    if (!Number.isInteger(value)) return 'Rating must be a whole number';
    return null;
  },
};
