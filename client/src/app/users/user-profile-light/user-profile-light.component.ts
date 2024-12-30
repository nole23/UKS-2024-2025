import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile-light',
  templateUrl: './user-profile-light.component.html',
  styleUrl: './user-profile-light.component.css'
})
export class UserProfileLightComponent implements OnInit {
  user: any;
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    let user = localStorage.getItem('user'); 
    if (user !== null && user !== undefined) {
      this.user = JSON.parse(user);
    }
  }

  getFirstLetter() {
    return this.user.first_name.charAt(0).toUpperCase();
  }

  logout() {
    this.userService.logout();
  }
}
