import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { RepositoryService } from '../../docker-hub/services/repository.service';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isInfoOpen: boolean;
  isNotificationsOpen: boolean;
  isTheamsOpen: boolean;
  isUserProfile: boolean;
  isSearchOpne: boolean;
  isSpiner: boolean;
  activeTab: any = {};
  community: any[];
  trust: any[];
  searchQuery$ = new Subject<string>();
  profile: any = {};
  
  constructor(
    private router: Router,
    private repository: RepositoryService,
    private userService: UserService
  ) {
    this.isInfoOpen = false;
    this.isNotificationsOpen = false;
    this.isTheamsOpen = false;
    this.isUserProfile = false;
    this.isSearchOpne = false;
    this.isSpiner = false;
    this.activeTab = {
      isDashboard: false,
      isOrgs: false,
      isUsage: false
    }
    this.community = [];
    this.trust = [];
  }

  ngOnInit(): void {
    let user = this.userService.getAuthorizedUser();
    if (user !== null) {
      this.profile = user;
    } else {
      alert('User is not authorized')
      this.userService.logout();
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('/dashboard/orgs')) {
          this.activeTab.isOrgs = true;
        } else if (this.router.url.includes('/dashboard/usage')) {
          this.activeTab.isUsage = true;
        } else if (this.router.url.startsWith('/dashboard')) {
          this.activeTab.isDashboard = true;
        }
      }
    });

    this.searchQuery$.pipe(
      debounceTime(1000),  // Odlaže pretragu dok korisnik ne prestane da kuca 500ms
      switchMap(query => this.repository.searchByText(query)) // Kada korisnik prestane sa kucanjem, šalje upit
    ).subscribe(
      (res: any) => {
        if (!res.status) {
          this.isSpiner = false;
          alert('Server is not respondent');
        } else {
          this.isSearchOpne = true;
          this.trust = res.message;
          this.isSpiner = false;
        }
      },
      (error) => {
        this.isSpiner = false;
        alert('An error occurred: ' + error.message);
      }
    );
  }

  openSubmenu(option: string) {
    if (option === 'info' && !this.isInfoOpen) {
      this._allClose();
      this.isInfoOpen = true;
    } else if (option === 'notification' && !this.isNotificationsOpen) {
      this._allClose();
      this.isNotificationsOpen = true;
    } else if (option === 'theams' && !this.isTheamsOpen) {
      this._allClose();
      this.isTheamsOpen = true;
    } else if (option === 'user-profile'  && !this.isUserProfile) {
      this._allClose();
      this.isUserProfile = true;
    } else {
      this._allClose();
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Proverite da li je klik bio van dropdown-a
    if (!target.closest('.dropdown-menu') && !target.closest('button')) {
      this._allClose();
    }
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length >= 3) {
      this.isSpiner = true; 
      this.searchQuery$.next(inputValue); // Emituje novi tekst za pretragu
    }
  }
  
  getFirstUppercaseLetter(word: string): string {
    if (!word || word.length === 0) return ''; // Provera za prazan string
    return word.charAt(0).toUpperCase(); // Uzimamo prvo slovo i pretvaramo ga u veliko
  }

  private _allClose() {
    this.isInfoOpen = false;
    this.isNotificationsOpen = false;
    this.isTheamsOpen = false;
    this.isUserProfile = false;
    this.isSearchOpne = false;
  }
}
