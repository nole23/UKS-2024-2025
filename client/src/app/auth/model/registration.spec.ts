import { Registration } from './registration';

describe('Registration', () => {

  it('should create an instance', () => {
    expect(new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123')).toBeTruthy();
  });

  // Testiranje email validacije
  it('should return false for invalid email', () => {
    const reg = new Registration('invalid-email', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidEmail(reg.email)).toBeFalse();
  });

  it('should return true for valid email', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidEmail(reg.email)).toBeTrue();
  });

  // Testiranje username validacije
  it('should return false for username less than 3 characters', () => {
    const reg = new Registration('test@example.com', 'us', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidUsername(reg.username)).toBeFalse();
  });

  it('should return true for username with 3 or more characters', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidUsername(reg.username)).toBeTrue();
  });

  // Testiranje validacije imena i prezimena
  it('should return false for empty first name', () => {
    const reg = new Registration('test@example.com', 'user123', '', 'Doe', 'password123', 'password123');
    expect(reg.isValidName(reg.first_name)).toBeFalse();
  });

  it('should return true for non-empty first name', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidName(reg.first_name)).toBeTrue();
  });

  it('should return false for empty last name', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', '', 'password123', 'password123');
    expect(reg.isValidName(reg.last_name)).toBeFalse();
  });

  it('should return true for non-empty last name', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidName(reg.last_name)).toBeTrue();
  });

  // Testiranje lozinke
  it('should return false for password shorter than 6 characters', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'short', 'short');
    expect(reg.isValidPassword(reg.password)).toBeFalse();
  });

  it('should return true for password with at least 6 characters', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValidPassword(reg.password)).toBeTrue();
  });

  // Testiranje potvrde lozinke
  it('should return false if passwords do not match', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'different123');
    expect(reg.doPasswordsMatch()).toBeFalse();
  });

  it('should return true if passwords match', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.doPasswordsMatch()).toBeTrue();
  });

  // Testiranje kompletne validacije registracije
  it('should return false for invalid registration data (email)', () => {
    const reg = new Registration('invalid-email', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValid()).toBeFalse();
  });

  it('should return false for invalid registration data (passwords do not match)', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'different123');
    expect(reg.isValid()).toBeFalse();
  });

  it('should return true for valid registration data', () => {
    const reg = new Registration('test@example.com', 'user123', 'John', 'Doe', 'password123', 'password123');
    expect(reg.isValid()).toBeTrue();
  });

});
