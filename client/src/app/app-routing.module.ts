import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UnauthenticatedGuard } from './auth.guard';
import { ErrorComponent } from './headers/error/error.component';

const routes: Routes = [
  // Lazy loading za Auth module
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [UnauthenticatedGuard] },

  // Lazy loading za Dashboard module
  { path: 'dashboard', loadChildren: () => import('./docker-hub/docker-hub.module').then(m => m.DockerHubModule), canActivate: [AuthGuard] },

  { path: 'u/:username', component: ErrorComponent, canActivate: [AuthGuard]},

  { path: 'u/setting/:username', component: ErrorComponent, canActivate: [AuthGuard]},

  // Preusmeravanje na login ako ruta nije pronađena
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }