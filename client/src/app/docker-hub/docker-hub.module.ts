import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Dodaj ovo

import { DockerHubComponent } from './docker-hub.component';
import { HomeComponent } from './home/home.component';
import { DockerHubRoutingModule } from './docker-hub-routing.module';
import { ErrorComponent } from '../headers/error/error.component';
import { RepositoryService } from './services/repository.service';
import { UserService } from './services/user.service';
import { CreateRepositoryComponent } from './repository/create-repository/create-repository.component';
import { RepositoriesComponent } from './repository/repositories.component';
import { RepositoryComponent } from './repository/repository/repository.component';
import { GeneralComponent } from './repository/repository/general/general.component';
import { RepositoryHeaderComponent } from './repository/repository/repository-header/repository-header.component';
import { TagsComponent } from './repository/repository/tags/tags.component';
import { CollaboratorsComponent } from './repository/repository/collaborators/collaborators.component';
import { SettingsComponent } from './repository/repository/settings/settings.component';

@NgModule({
  declarations: [
    DockerHubComponent,
    HomeComponent,
    CreateRepositoryComponent,
    RepositoriesComponent,
    RepositoryComponent,
    GeneralComponent,
    RepositoryHeaderComponent,
    TagsComponent,
    CollaboratorsComponent,
    SettingsComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    DockerHubRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    RepositoryService,
    UserService
  ]
})
export class DockerHubModule { }
