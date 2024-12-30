export class DockerHub {
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DockerHubComponent } from './docker-hub.component';
import { ErrorComponent } from '../headers/error/error.component';

const routes: Routes = [
  { path: '', component: DockerHubComponent, children: [
    { path: '', component: HomeComponent},
    { path: 'repository-settings', component: ErrorComponent, children: [
      { path: 'default-privacy', component: ErrorComponent}
    ]},
    { path: 'orgs', component: ErrorComponent},
    { path: 'usage', component: ErrorComponent},
    { path: 'u/:username', component: ErrorComponent},
    { path: 'settings', component: ErrorComponent},
    { path: 'billing', component: ErrorComponent},
    { path: 'r/:username/:repository-name', component: ErrorComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerHubRoutingModule { }