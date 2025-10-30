/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validates form fields
 * @param fields - Object with field names as keys and values to check
 * @returns Object with validation results and first missing field
 */
export function validateFormFields(fields: Record<string, unknown>): {
  isValid: boolean;
  missingField?: string;
} {
  for (const [fieldName, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        isValid: false,
        missingField: fieldName,
      };
    }
  }
  return { isValid: true };
}

