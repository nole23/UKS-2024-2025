import { Login } from './login';

describe('Login', () => {
  
  // Testiranje inicijalizacije
  it('should create an instance', () => {
    const login = new Login('test@example.com', 'password123');
    expect(login).toBeTruthy();  // Proveravamo da li objekat može biti inicijalizovan
  });

  // Testiranje validnosti email-a
  it('should return true for valid email', () => {
    const login = new Login('test@example.com', 'password123');
    expect(login.isValidEmail(login.email)).toBe(true);  // Proveravamo ispravnost email-a
  });

  it('should return false for invalid email', () => {
    const login = new Login('invalid-email', 'password123');
    expect(login.isValidEmail(login.email)).toBe(false);  // Proveravamo pogrešan email
  });

  // Testiranje validnosti password-a
  it('should return true for valid password (min. 6 characters)', () => {
    const login = new Login('test@example.com', 'password123');
    expect(login.isValidPassword(login.password)).toBe(true);  // Proveravamo da li je password validan
  });

  it('should return false for invalid password (less than 6 characters)', () => {
    const login = new Login('test@example.com', '123');
    expect(login.isValidPassword(login.password)).toBe(false);  // Proveravamo password sa manje od 6 karaktera
  });

  // Testiranje validnosti ukupne validacije
  it('should return true for valid email and password', () => {
    const login = new Login('test@example.com', 'password123');
    expect(login.isValid()).toBe(true);  // Proveravamo ukupnu validnost (email i password)
  });

  it('should return false for invalid email', () => {
    const login = new Login('invalid-email', 'password123');
    expect(login.isValid()).toBe(false);  // Proveravamo da li je email neispravan
  });

  it('should return false for invalid password', () => {
    const login = new Login('test@example.com', '123');
    expect(login.isValid()).toBe(false);  // Proveravamo da li je password prekratak
  });

  it('should return false for both invalid email and password', () => {
    const login = new Login('invalid-email', '123');
    expect(login.isValid()).toBe(false);  // Proveravamo oba parametra (neispravan email i password)
  });
});
