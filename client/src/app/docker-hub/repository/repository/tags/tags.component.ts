import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { RepositoryService } from '../../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {
  form: FormGroup;
  tagForm: FormGroup;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  repositoryName: any = '';
  tags: any = [];
  tagsBackup: any = [];
  profile: any = {};
  anySelected: boolean = false;  // Da li je neki checkbox označen
  repositoryData: any = {};

  constructor(
    private userService: UserService,
    private repository: RepositoryService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
      this.form = this.fb.group({
        removeCheck: [false]  // Ovaj checkbox će kontrolisati sve ostale
      });

      this.tagForm = this.fb.group({
        version: ['1.0.0', [Validators.required]], // Podrazumevana verzija
        name: ['', [Validators.required]], // Polje za ime
        description: [''] // Polje za opis
      });
    }

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

    // Pratimo promene u checkboxu
    this.form.get('removeCheck')?.valueChanges.subscribe(value => {
      this.toggleAllCheckboxes();
    });
  }

  private _getRepository(repositoryName: any) {
    this.repository.getOneRepositoryByName(repositoryName, this.profile.username).subscribe((res: any) => {
      if (res.status) {
        this.repositoryData = res.message;

        this._getTags(this.repositoryData);
      }
    })
  }

  private _getTags(repositoryData: any) {
    this.repository.getTagsByRepository(repositoryData.id).subscribe((res: any) => {
      if (res.status) {
        this.tags = res.message;

        this.sortTags(null);
      
      }
    })
  }

  // Metoda koja označava ili poništava sve checkboxove
  toggleAllCheckboxes(event?: any) {
    const isChecked = this.form.get('removeCheck')?.value;
    this.tags.forEach((tag: any) => {
      tag.selected = isChecked;
    });
    this.anySelected = this.tags.some((tag: any) => tag.selected);
  }

  // Pomoćna metoda koja prati da li su neki checkboxovi označeni
  onCheckboxChange() {
    this.anySelected = this.tags.some((tag: any) => tag.selected);
  }

  // Funkcija koja se poziva kada se menja stanje pojedinačnog checkboxa
  onTagCheckboxChange() {
    // Provjeri da li je barem jedan tag označen
    this.anySelected = this.tags.some((tag: any) => tag.selected);
  }

  // Funkcija koja briše označene tagove
  deleteSelectedTags() {
    let listDeletedTags = this.tags
      .filter((tag: any) => tag.selected)  // Filtriraj samo označene tagove
      .map((tag: any) => tag.id);  // Vratiti samo id od označenih tagova

    this.repository.removeTags(listDeletedTags).subscribe((res: any) => {
      if (res.status) {
        alert('Remove tags')
        
        this.tags = this.tags.filter((tag: any) => !listDeletedTags.includes(tag.id));
      }
    })
  }

  sortTags(event: any): void {
    let criteria = "1";
    if (event !== null) {
      criteria = event.target.value;
    }
    
    switch (criteria) {
        case '1': // Newest
            this.tags.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            break;
        case '2': // Oldest
            this.tags.sort((a: any, b: any) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
            break;
        case '3': // A - Z (by name)
            this.tags.sort((a: any, b: any) => a.name.localeCompare(b.name));
            break;
        case '4': // Z - A (by name)
            this.tags.sort((a: any, b: any) => b.name.localeCompare(a.name));
            break;
        default:
            break;
    }
  }

  onFilterTags(event: any): void {
    let value = event.target.value;
    if (value.length >= 3) {
      // this.searchSubject.next(value); // Prosleđuje tekst za filtriranje
      if (this.tagsBackup.length === 0) {
        this.tagsBackup = this.tags;
      }
      this.tags = this.tags.filter((tag: any) => {
        return Object.values(tag).some((val: any) => 
          val.toString().toLowerCase().includes(value.toLowerCase())
        );
      });
    } else {
      // this.filteredTags = [...this.tags]; // Resetuje prikaz ako je manje od 3 karaktera
      if (this.tagsBackup.length > 0) {
        this.tags = this.tagsBackup;
        this.tagsBackup = [];
      }
    }
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

  onSubmit() {
    if (this.tagForm.valid) {
      const newTag = this.tagForm.value;

      this.repository.addNewTag(this.repositoryData.id, newTag, this.profile.username).subscribe((res: any) => {
        if (res.status) {
          alert('Successifful add new tag')
          this.tags.push(res.message);
        }

        // Resetovanje forme nakon uspešnog dodavanja
        this.tagForm.reset({ version: '1.0.0', name: '', description: '' });

        this.closeButton.nativeElement.click();
      });
    }
  }
}
