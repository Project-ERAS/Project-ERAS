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
