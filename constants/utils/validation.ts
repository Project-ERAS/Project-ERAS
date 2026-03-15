export type EmailValidationResult = {
  ok: boolean;
  message?: string;
};

export type PasswordChecks = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export type PasswordValidationResult = {
  ok: boolean;
  message?: string;
  checks: PasswordChecks;
};

export function validateEmail(rawEmail: string): EmailValidationResult {
  const email = rawEmail.trim();

  if (email.length === 0) {
    return { ok: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, message: "Enter a valid email address" };
  }

  return { ok: true };
}
