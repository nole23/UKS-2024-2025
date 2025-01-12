import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-repository-header',
  templateUrl: './repository-header.component.html',
  styleUrl: './repository-header.component.css'
})
export class RepositoryHeaderComponent implements OnInit {
  profile: any = {};
  repositoryName: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
    } else {
      alert('User is not authorized')
      this.userService.logout();
    }

    const urlSegments = this.route.snapshot.url;
    // Uzimanje poslednjeg segmenta
    this.repositoryName = urlSegments[urlSegments.length - 1]?.path || '';
  }
}
