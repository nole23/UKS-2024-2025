import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-basic.component.html',
  styleUrl: './profile-basic.component.css'
})
export class ProfileBasicComponent implements OnInit {
  profile: any = {};

  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
      console.log(this.profile)
    } else {
      alert('User is not authorized')
      this.userService.logout();
    }
  }

  getFirstUppercaseLetter(word: string): string {
    if (!word || word.length === 0) return ''; // Provera za prazan string
    return word.charAt(0).toUpperCase(); // Uzimamo prvo slovo i pretvaramo ga u veliko
  }  

}
