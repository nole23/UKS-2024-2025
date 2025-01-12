import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RepositoryService } from '../../../services/repository.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent implements OnInit {
  form: FormGroup;
  
  profile: any = {};
  repositoryData: any = {};
  isShowDescription: boolean = true;
  repositoryDescriton: string = '';
  tagsData: any = [];

  constructor(
    private userService: UserService,
    private repository: RepositoryService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
      this.form = this.fb.group({
        repositoryDescriton: ['', [Validators.required, Validators.required]],
      });
    }

  ngOnInit(): void {
    // Pretplati se na podatke iz servisa
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
    } else {
      alert('User is not authorized')
      this.userService.logout();
    }

    this.route.parent?.paramMap.subscribe(params => {
      let repositoryName = params.get('repository-name');
      this._getRepository(repositoryName);
    });
  }

  getTimeAgo(dateString: any) {
    const now = new Date();
    const date = new Date(dateString);

    // Provera validnosti datuma
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const diffInMs = now.getTime() - date.getTime(); // Razlika u milisekundama
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `last push ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `last push ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `last push ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `last push just now`;
    }
  }

  updateDescriotion() {
    this.repositoryData.description = this.repositoryDescriton;
    this.repository.updateRepository(this.repositoryData, this.profile).subscribe((res: any) => {
      if (res.status) {
        alert('Success updated')
        this.isShowDescription = !this.isShowDescription;
      } else {
        alert('Update is not confirm.')
      }
    })
  }
  
  private _getRepository(repositoryName: any) {
    this.repository.getOneRepositoryByName(repositoryName, this.profile.username).subscribe((res: any) => {
      if (res.status) {
        this.repositoryData = res.message;
        this.repositoryDescriton = this.repositoryData.description

        this._getTags();
      }
    })
  }

  private _getTags() {
    this.repository.getTagsByRepository(this.repositoryData.id).subscribe((res: any) => {
      if (res.status) {
        this.tagsData = res.data;
      }
    })
  } 
}
