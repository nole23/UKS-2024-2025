import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Login } from '../model/login';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;  // HTTP mock za testiranje
  const API_URL = 'http://localhost:8000/api/users/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Dodajemo HttpClientTestingModule
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);  // Injektovanje HTTP mock-a

    // Špioniranje setItem metode
    // spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    httpMock.verify();  // Verifikacija svih HTTP zahteva nakon svakog testa
  });

  it('should be created', () => {
    expect(service).toBeTruthy();  // Testiranje da li je servis kreiran
  });

  it('should call login service and return success response', () => {
    const loginUser = new Login('test@example.com', 'password123');
    const mockResponse = { status: true, user: { id: 1, email: 'test@example.com' } };

    service.login(loginUser).subscribe(response => {
      expect(response.status).toBe(true);  // Proveravamo da li je login uspešan
    });

    // Očekujemo da se napravi HTTP POST zahtev
    const req = httpMock.expectOne(API_URL + 'login/');
    expect(req.request.method).toBe('POST');  // Proveravamo da li je metoda POST
    req.flush(mockResponse);  // Ove simuliramo odgovor sa mock podacima
  });

  it('should return error message on invalid credentials', () => {
    const loginUser = new Login('wrong@example.com', 'wrongpassword');
    const mockErrorResponse = { status: false, message: 'INVALID_CREDENTIALS' };

    service.login(loginUser).subscribe(response => {
      expect(response.status).toBe(false);  // Proveravamo da li je status neuspešan
    });

    const req = httpMock.expectOne(API_URL + 'login/');
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });  // Simuliramo grešku 400
  });

  it('should return server error message on server failure', () => {
    const loginUser = new Login('test@example.com', 'password123');
    const mockErrorResponse = { status: false, message: 'Server Error' };

    service.login(loginUser).subscribe(response => {
      expect(response.status).toBe(false);
      expect(response.message).toBe('Server Error. Please try again later.');
    });

    const req = httpMock.expectOne(API_URL + 'login/');
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse, { status: 500, statusText: 'Internal Server Error' });  // Simuliramo grešku 500
  });

  it('should handle unexpected errors gracefully', () => {
    const loginUser = new Login('test@example.com', 'password123');

    service.login(loginUser).subscribe(response => {
      expect(response.status).toBe(false);
      expect(response.message).toBe('An unexpected error occurred.');
    });

    const req = httpMock.expectOne(API_URL + 'login/');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'));  // Simuliramo nepredviđenu grešku
  });

});
