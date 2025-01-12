import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser = {
    username: 'nole23',
    email: 'nole23@example.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUserIsMyOrganization', () => {
    it('should return data if the response is successful', () => {
      const username = 'nole23';
      const mockResponse = { message: 'SUCCESS', data: ['user1', 'user2'] };

      service.getAllUserIsMyOrganization(username).subscribe(response => {
        expect(response.status).toBeTrue();
        expect(response.message).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`${service['API_URL']}myfriends?username=${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle 500 error', () => {
      const username = 'nole23';

      service.getAllUserIsMyOrganization(username).subscribe(response => {
        expect(response.status).toBeFalse();
        expect(response.message).toEqual('Server Error. Please try again later.');
      });

      const req = httpMock.expectOne(`${service['API_URL']}myfriends?username=${username}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle unexpected errors', () => {
      const username = 'nole23';

      service.getAllUserIsMyOrganization(username).subscribe(response => {
        expect(response.status).toBeFalse();
        expect(response.message).toEqual('An unexpected error occurred.');
      });

      const req = httpMock.expectOne(`${service['API_URL']}myfriends?username=${username}`);
      req.flush('Unexpected error', { status: 0, statusText: 'Unknown Error' });
    });
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });
});
