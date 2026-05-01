import { describe, it, expect } from 'vitest';
import { validateName, validateEmail, validateMobile, validateDepartment } from './validators';

describe('validateName', () => {
  it('returns empty string for a valid name', () => {
    expect(validateName('John Doe')).toBe('');
  });

  it('returns empty string for a valid single name with 2 characters', () => {
    expect(validateName('Jo')).toBe('');
  });

  it('returns empty string for a name at max length of 50 characters', () => {
    const name = 'A'.repeat(50);
    expect(validateName(name)).toBe('');
  });

  it('returns error when name is empty string', () => {
    expect(validateName('')).toBe('Full name is required');
  });

  it('returns error when name is only whitespace', () => {
    expect(validateName('   ')).toBe('Full name is required');
  });

  it('returns error when name is undefined', () => {
    expect(validateName(undefined)).toBe('Full name is required');
  });

  it('returns error when name is null', () => {
    expect(validateName(null)).toBe('Full name is required');
  });

  it('returns error when name contains numbers', () => {
    expect(validateName('John123')).toBe('Full name must contain only alphabets and spaces');
  });

  it('returns error when name contains special characters', () => {
    expect(validateName('John@Doe')).toBe('Full name must contain only alphabets and spaces');
  });

  it('returns error when name contains hyphens', () => {
    expect(validateName('Mary-Jane')).toBe('Full name must contain only alphabets and spaces');
  });

  it('returns error when name is less than 2 characters', () => {
    expect(validateName('J')).toBe('Full name must be at least 2 characters');
  });

  it('returns error when name exceeds 50 characters', () => {
    const name = 'A'.repeat(51);
    expect(validateName(name)).toBe('Full name must not exceed 50 characters');
  });
});

describe('validateEmail', () => {
  it('returns empty string for a valid email', () => {
    expect(validateEmail('john@example.com')).toBe('');
  });

  it('returns empty string for a valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe('');
  });

  it('returns error when email is empty', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error when email is undefined', () => {
    expect(validateEmail(undefined)).toBe('Email is required');
  });

  it('returns error when email is only whitespace', () => {
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error when email is missing @', () => {
    expect(validateEmail('johnexample.com')).toBe('Please enter a valid email address');
  });

  it('returns error when email has no domain', () => {
    expect(validateEmail('john@')).toBe('Please enter a valid email address');
  });

  it('returns error when email has no local part', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address');
  });

  it('returns error when email has no TLD', () => {
    expect(validateEmail('john@example')).toBe('Please enter a valid email address');
  });

  it('returns error when email contains spaces', () => {
    expect(validateEmail('john doe@example.com')).toBe('Please enter a valid email address');
  });
});

describe('validateMobile', () => {
  it('returns empty string for exactly 10 digits', () => {
    expect(validateMobile('9876543210')).toBe('');
  });

  it('returns error when mobile is empty', () => {
    expect(validateMobile('')).toBe('Mobile number is required');
  });

  it('returns error when mobile is undefined', () => {
    expect(validateMobile(undefined)).toBe('Mobile number is required');
  });

  it('returns error when mobile is only whitespace', () => {
    expect(validateMobile('   ')).toBe('Mobile number is required');
  });

  it('returns error when mobile has 9 digits', () => {
    expect(validateMobile('987654321')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile has 11 digits', () => {
    expect(validateMobile('98765432101')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile contains letters', () => {
    expect(validateMobile('98765abcde')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile contains special characters', () => {
    expect(validateMobile('987-654-32')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile contains spaces', () => {
    expect(validateMobile('987 654 32')).toBe('Mobile number must be exactly 10 digits');
  });
});

describe('validateDepartment', () => {
  it('returns empty string for a non-empty department', () => {
    expect(validateDepartment('Engineering')).toBe('');
  });

  it('returns empty string for any non-empty string', () => {
    expect(validateDepartment('HR')).toBe('');
  });

  it('returns error when department is empty string', () => {
    expect(validateDepartment('')).toBe('Department is required');
  });

  it('returns error when department is undefined', () => {
    expect(validateDepartment(undefined)).toBe('Department is required');
  });

  it('returns error when department is null', () => {
    expect(validateDepartment(null)).toBe('Department is required');
  });

  it('returns error when department is only whitespace', () => {
    expect(validateDepartment('   ')).toBe('Department is required');
  });
});