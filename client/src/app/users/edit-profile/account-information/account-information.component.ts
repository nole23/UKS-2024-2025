import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrl: './account-information.component.css'
})
export class AccountInformationComponent implements OnInit {
  form: FormGroup;
  isSaveEnabled: boolean = false; // Ovo kontroliše dugme "Save

  user: any = {};

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      bio: [''],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.isSaveEnabled = this.isAnyFieldFilled();
    });

    this.userService.getUser().subscribe((res: any) => {
      if (res.status) {
        this.user = res.message;
      }
    })
  }

  isAnyFieldFilled(): boolean {
    const controls = this.form.controls;
    return Object.values(controls).some(control => control.value && control.value.trim() !== '');
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe((res: any) => {
      if (res.status) {
        alert('Update is successifull')
      } else {
        alert('Update is not confirm.')
      }
    })
  }
}
