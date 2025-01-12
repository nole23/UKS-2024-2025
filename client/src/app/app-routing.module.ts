import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UnauthenticatedGuard } from './auth.guard';
import { ProfileComponent } from './users/profile/profile.component';
import { ContactComponent } from './common/support/contact/contact.component';
import { EditProfileComponent } from './users/edit-profile/edit-profile.component';
import { ProfileBasicComponent } from './users/edit-profile/profile/profile-basic.component';
import { AccountInformationComponent } from './users/edit-profile/account-information/account-information.component';
import { EmailComponent } from './users/edit-profile/email/email.component';

const routes: Routes = [
  // Lazy loading za Auth module
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [UnauthenticatedGuard] },

  // Lazy loading za Dashboard module
  { path: 'dashboard', loadChildren: () => import('./docker-hub/docker-hub.module').then(m => m.DockerHubModule), canActivate: [AuthGuard] },

  { path: 'support/contact', component: ContactComponent, canActivate: [AuthGuard] },

  { path: 'u/:username', component: ProfileComponent, canActivate: [AuthGuard]},

  { path: 'u/setting/:username', component: EditProfileComponent, children: [
    { path: '', component: ProfileBasicComponent, canActivate: [AuthGuard]},
    { path: 'account-information', component: AccountInformationComponent, canActivate: [AuthGuard]},
    { path: 'email', component: EmailComponent, canActivate: [AuthGuard]}
  ]},

  // Preusmeravanje na login ako ruta nije pronađena
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }