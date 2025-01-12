import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  
  repositoryName: any = '';
  repositoryData: any = {};
  repositoryDataBack: any = {};
  profile: any = {};

  constructor(
    private userService: UserService,
    private repository: RepositoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
    } else {
      alert('User is not authorized')
      this.userService.logout();
    }

    this.route.parent?.paramMap.subscribe(params => {
      this.repositoryName = params.get('repository-name');
      this._getRepository(this.repositoryName);
    });
  }

  private _getRepository(repositoryName: any) {
    this.repository.getOneRepositoryByName(repositoryName, this.profile.username).subscribe((res: any) => {
      if (res.status) {
        this.repositoryData = res.message;
        this.repositoryDataBack = JSON.parse(JSON.stringify(this.repositoryData));
      }
    })
  }

  restart() {
    console.log(this.repositoryDataBack)
    this.repositoryData = this.repositoryDataBack;
  }

  savePrivate() {
    this.repository.updateSettings(this.repositoryData).subscribe((res: any) => {
      if (res.status) {
        alert('Update is successifull.')
      } else {
        alert('server is not responding')
      }
    })
  }

  removeRepository() {
    console.log(this.repositoryData)
    this.repository.removeReposiroty(this.repositoryData.id).subscribe((res: any) => {
      if (res.status) {
        alert('Remove is successifull')
        this.closeButton.nativeElement.click();
        this.router.navigate(['/dashboard']);
      } else {
        alert('Remove is not posible')
      }
    })
  }
}
