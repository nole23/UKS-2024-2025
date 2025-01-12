import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent implements OnInit {
  form: FormGroup;
  isSaveEnabled: boolean = false; // Ovo kontroliše dugme "Save

  user: any = {};

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      email: ['']
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
