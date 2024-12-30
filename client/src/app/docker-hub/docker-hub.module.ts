import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockerHubComponent } from './docker-hub.component';
import { HomeComponent } from './home/home.component';
import { DockerHubRoutingModule } from './docker-hub-routing.module';
import { ErrorComponent } from '../headers/error/error.component';
import { HttpClientModule } from '@angular/common/http';  // Dodaj ovo
import { RepositoryService } from './services/repository.service';

@NgModule({
  declarations: [
    DockerHubComponent,
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    DockerHubRoutingModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    RepositoryService
  ]
})
export class DockerHubModule { }
