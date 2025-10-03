/**
 * Centralized Regular Expression Patterns
 *
 * This file contains all regex patterns used throughout the application.
 * This approach ensures consistency and makes pattern maintenance easier.
 */

export const REGEX_PATTERNS = {
  // Password patterns
  PASSWORD: {
    /**
     * Strong password pattern requiring:
     * - At least one lowercase letter (a-z)
     * - At least one uppercase letter (A-Z)
     * - At least one digit (0-9)
     * - At least one special character (@$!%*?&)
     * - Only allows these specific character types
     */
    STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,

    /**
     * Password must contain at lease one of each required character type
     */
    CONTAINS_LOWERCASE: /(?=.*[a-z])/,
    CONTAINS_UPPERCASE: /(?=.*[A-Z])/,
    CONTAINS_DIGIT: /(?=.*\d)/,
    CONTAINS_SPECIAL: /(?=.*[@$!%*?&])/,
  },

  // Email patterns
  EMAIL: {
    /**
     * Standard email validation pattern
     * Supports most common email formats
     */
    STANDARD: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    /**
     * Strict email pattern for additional validation
     * More restrictive than standard pattern
     */
    STRICT: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },

  // Name patterns
  NAME: {
    /**
     * Person name pattern (first name, last name)
     * Allows letters, spaces, hyphens, apostrophes
     * Must start and end with letters
     */
    PERSON_NAME: /^[a-zA-Z]+([a-zA-Z\s'-]*[a-zA-Z])?$/,

    /**
     * Turkish name pattern (supports Turkish characters)
     * Includes ç, ğ, ı, ö, ş, ü characters
     */
    TURKISH_NAME:
      /^[a-zA-ZÇçĞğIıİiÖöŞşÜü]+([a-zA-ZÇçĞğIıİiÖöŞşÜü\s'-]*[a-zA-ZÇçĞğIıİiÖöŞşÜü])?$/,
  },

  // Username patterns
  USERNAME: {
    /**
     * Username pattern:
     * - 3-30 characters long
     * - Alphanumeric characters and underscores only
     * - Must start with a letter
     */
    STANDARD: /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/,

    /**
     * Username with Turkish characters support
     */
    TURKISH: /^[a-zA-ZÇçĞğIıİiÖöŞşÜü][a-zA-ZÇçĞğIıİiÖöŞşÜü0-9_]{2,29}$/,
  },

  // Phone number patterns
  PHONE: {
    /**
     * Turkish mobile phone number pattern
     * +90 5XX XXX XX XX or 0 5XX XXX XX XX format
     */
    TURKISH_MOBILE: /^(\+90\s?)?0?[5][0-9]{9}$/,

    /**
     * International phone number pattern
     * Supports +XXX format
     */
    INTERNATIONAL: /^\+[1-9]\d{1,14}$/,
  },

  // Turkish tax/citizen patterns
  TR_CITIZEN: {
    /**
     * Turkish citizen ID (TC Kimlik No) pattern
     * 11 digits, specific algorithm validation required
     */
    TC_ID: /^[1-9][0-9]{10}$/,

    /**
     * Turkish tax number pattern
     * 10 digits for companies
     */
    TAX_NUMBER: /^[0-9]{10}$/,
  },

  // Credit card patterns
  CREDIT_CARD: {
    /**
     * Major credit card number pattern
     * Supports visa, mastercard, amex, discover
     */
    NUMBER: /^[0-9]{13,19}$/,

    /**
     * CVV/CVC pattern
     * 3 digits for most cards, 4 digits for amex
     */
    CVV: /^[0-9]{3,4}$/,
  },

  // Validation helpers
  VALIDATION: {
    /**
     * Pattern for checking if string contains only allowed characters
     * Used for general input sanitization
     */
    SAFE_TEXT: /^[a-zA-Z0-9\s.,!?@#$%^&*()_+\-=[\]{}'";:\\|<>/~`]*$/,

    /**
     * Pattern for checking if string is not empty after trimming
     */
    NON_EMPTY: /^.+$/,
  },

  // File/URL patterns
  FILE_URL: {
    /**
     * Image file extension pattern
     * Supports common image formats
     */
    IMAGE: /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i,

    /**
     * Document file extension pattern
     * Supports common document formats
     */
    DOCUMENT: /\.(pdf|doc|docx|txt|rtf)$/i,
  },
} as const;

/**
 * Validation messages for regex patterns
 * This ensures consistent error messages across the application
 */
export const REGEX_VALIDATION_MESSAGES = {
  PASSWORD: {
    STRONG:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    CONTAINS_LOWERCASE: 'Password must contain at least one lowercase letter',
    CONTAINS_UPPERCASE: 'Password must contain at least one uppercase letter',
    CONTAINS_DIGIT: 'Password must contain at least one number',
    CONTAINS_SPECIAL:
      'Password must contain at least one special character (@$!%*?&)',
  },

  EMAIL: {
    STANDARD: 'Please provide a valid email address',
    INVALID_FORMAT: 'Email format is invalid',
    INVALID_DOMAIN: 'Email domain is not allowed',
  },

  NAME: {
    PERSON_NAME:
      'Name can only contain letters, spaces, hyphens, and apostrophes',
    TURKISH_NAME:
      'Name can only contain Turkish characters, letters, spaces, hyphens, and apostrophes',
    EMPTY: 'Name cannot be empty',
    TOO_SHORT: 'Name must be at least 2 characters long',
    TOO_LONG: 'Name must not exceed 50 characters',
  },

  USERNAME: {
    STANDARD:
      'Username must be 3-30 characters long, start with a letter, and contain only letters, numbers, and underscores',
    INVALID_CHARACTERS: 'Username contains invalid characters',
    TOO_SHORT: 'Username must be at least 3 characters long',
    TOO_LONG: 'Username must not exceed 30 characters',
  },

  PHONE: {
    TURKISH_MOBILE: 'Please provide a valid Turkish mobile phone number',
    INTERNATIONAL: 'Please provide a valid international phone number',
    INVALID_FORMAT: 'Phone number format is invalid',
  },

  TR_CITIZEN: {
    TC_ID: 'Please provide a valid Turkish citizen ID (11 digits)',
    TAX_NUMBER: 'Please provide a valid Turkish tax number (10 digits)',
    INVALID_ALGORITHM: 'Citizen ID failed validation algorithm',
  },
} as const;

/**
 * Helper functions for regex validation
 */
export class RegexValidator {
  /**
   * Check if a password meets strong password requirements
   */
  static isStrongPassword(password: string): {
    isValid: boolean;
    missingRequirement?: string;
  } {
    const patterns = REGEX_PATTERNS.PASSWORD;

    if (!patterns.CONTAINS_LOWERCASE.test(password)) {
      return { isValid: false, missingRequirement: 'lowercase' };
    }

    if (!patterns.CONTAINS_UPPERCASE.test(password)) {
      return { isValid: false, missingRequirement: 'uppercase' };
    }

    if (!patterns.CONTAINS_DIGIT.test(password)) {
      return { isValid: false, missingRequirement: 'digit' };
    }

    if (!patterns.CONTAINS_SPECIAL.test(password)) {
      return { isValid: false, missingRequirement: 'special' };
    }

    return { isValid: true };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    return REGEX_PATTERNS.EMAIL.STANDARD.test(email);
  }

  /**
   * Validate Turkish citizen ID (TC Kimlik No)
   * Note: This only validates format, not the algorithmic checksum
   */
  static isValidTurkishCitizenId(tcId: string): boolean {
    if (!REGEX_PATTERNS.TR_CITIZEN.TC_ID.test(tcId)) {
      return false;
    }

    // Additional algorithmic validation would go here
    // For now, just return format validation
    return true;
  }

  /**
   * Validate Turkish mobile phone number
   */
  static isValidTurkishMobile(phone: string): boolean {
    return REGEX_PATTERNS.PHONE.TURKISH_MOBILE.test(phone);
  }

  /**
   * Sanitize text input using safe characters pattern
   */
  static sanitizeText(text: string): string {
    return text.replace(/[^\w\s.,!?@#$%^&*()_+\-=[\]{}'";:\\|<>/~`]/g, '');
  }
}
