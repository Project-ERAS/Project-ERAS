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
export function validatePassword(password: string): PasswordValidationResult {
  const checks: PasswordChecks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const ok =
    checks.minLength &&
    checks.hasUppercase &&
    checks.hasLowercase &&
    checks.hasNumber &&
    checks.hasSpecial;

  if (ok) {
    return { ok: true, checks };
  }

  if (password.length === 0) {
    return { ok: false, message: "Password is required", checks };
  }

  const missing: string[] = [];
  if (!checks.minLength) missing.push("at least 8 characters");
  if (!checks.hasUppercase) missing.push("an uppercase letter");
  if (!checks.hasLowercase) missing.push("a lowercase letter");
  if (!checks.hasNumber) missing.push("a number");
  if (!checks.hasSpecial) missing.push("a special character");

  const message =
    missing.length > 0
      ? `Password must include ${missing.join(", ")}`
      : "Password does not meet requirements";

  return { ok: false, message, checks };
}
