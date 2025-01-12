import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { RepositoryService } from '../../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.css'
})
export class CollaboratorsComponent implements OnInit {
  profile: any = {};
  userSearch: string = '';
  findeUser: any = [];
  isAnySelected: boolean = false;
  repositoryName: any = '';

  constructor(
    private userService: UserService,
    private repositortyService: RepositoryService,
    private route: ActivatedRoute
  ) {}

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
      this.repositoryName = params.get('repository-name');
    });
  }

  onFilterTags(event: any): void {
    let value = event.target.value;
    if (value.length >= 1) {
      // this.searchSubject.next(value); // Prosleđuje tekst za filtriranje
      this.userService.searchUserByQuery(value).subscribe((res: any) => {
        if (res.status) {
          this.findeUser = res.message;
        }
      })
    }
  }

  addCollaborator() {
    const selectedUsers = this.findeUser.filter((user: any) => user.selected).map((user: any) => user.username);
    this.repositortyService.addCollaborator({repositoryName: this.repositoryName, selectedUsers: selectedUsers}).subscribe((res: any) => {
      if (res.status) {
        alert('Add new collaborated');
      }
    })
  }

  onCheckboxChange(selectedUser: any): void {
    // Proveri da li je bilo koji checkbox selektovan
    this.isAnySelected = this.findeUser.some((user: any) => user.selected);

    // Ako je trenutni checkbox selektovan, svi ostali ostaju disabled
    if (selectedUser.selected) {
      this.findeUser.forEach((user: any) => {
        if (user !== selectedUser) {
          user.disabled = true;
        }
      });
    } else {
      // Ako nijedan checkbox nije selektovan, svi se ponovo omogućavaju
      this.findeUser.forEach((user: any) => {
        user.disabled = false;
      });
    }
  }
}
