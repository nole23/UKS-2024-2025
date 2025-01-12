export class DockerHub {
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DockerHubComponent } from './docker-hub.component';
import { ErrorComponent } from '../headers/error/error.component';
import { CreateRepositoryComponent } from './repository/create-repository/create-repository.component';
import { RepositoriesComponent } from './repository/repositories.component';
import { RepositoryComponent } from './repository/repository/repository.component';
import { GeneralComponent } from './repository/repository/general/general.component';
import { TagsComponent } from './repository/repository/tags/tags.component';
import { CollaboratorsComponent } from './repository/repository/collaborators/collaborators.component';
import { SettingsComponent } from './repository/repository/settings/settings.component';

const routes: Routes = [
  { path: '', component: DockerHubComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'repository-settings', component: ErrorComponent, children: [
      { path: 'default-privacy', component: ErrorComponent }
    ]},
    { path: 'repository', component: RepositoriesComponent, children: [
      { path: 'create', component: CreateRepositoryComponent },
      { path: 'docker/:username/:repository-name', component: RepositoryComponent, children: [
        { path: 'general', component: GeneralComponent },
        { path: 'tags', component: TagsComponent },
        { path: 'builds', component: ErrorComponent },
        { path: 'collaborators', component: CollaboratorsComponent },
        { path: 'webhooks', component: ErrorComponent },
        { path: 'settings', component: SettingsComponent }
      ]},
    ]},
    { path: 'orgs', component: ErrorComponent },
    { path: 'usage', component: ErrorComponent },
    { path: 'settings', component: ErrorComponent },
    { path: 'billing', component: ErrorComponent },
    { path: 'public-view', component: ErrorComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerHubRoutingModule { }