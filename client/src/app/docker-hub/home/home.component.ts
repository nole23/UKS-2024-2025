import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RepositoryService } from '../services/repository.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  profile: any = {};
  allUserInMyOrganization: any = [];
  allRepository: any = [];
  storageAllRepository: any = [];
  
  constructor(private userService: UserService, private repository: RepositoryService) {}

  ngOnInit(): void {
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
    } else {
      alert('User is not authorized')
      this.userService.logout();
    }

    this.userService.getAllUserIsMyOrganization(this.profile.username).subscribe((res: any) => {
      if (res.status) {
        this.allUserInMyOrganization = res.message
        this.allUserInMyOrganization.push(this.profile)
      }
    })

    this.repository.getAllRepositoryByUsernam(this.profile.username).subscribe((res: any) => {
      if (res.status) {
        this.allRepository = res.message
      }
    })
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length >= 3) {
      
      // this.isSpiner = true; 
      // this.searchQuery$.next(inputValue); // Emituje novi tekst za pretragu
      this.storageAllRepository = this.allRepository;
      this.repository.getRepositoryByName({username: this.profile.username, repositoryName: inputValue}).subscribe((res: any) => {
        if (res.status) {
          this.allRepository = res.message;
        } else {
          this.allRepository = this.storageAllRepository;
          this.storageAllRepository = null;
        }
      })
    } else {
      this.allRepository = this.storageAllRepository;
      this.storageAllRepository = null;
    }
  }

}
