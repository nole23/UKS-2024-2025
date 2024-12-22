import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockerHubRoutingModule } from './docker-hub-routing.module';
import { DockerHubComponent } from './docker-hub.component';

@NgModule({
  declarations: [
    DockerHubComponent
  ],
  imports: [
    CommonModule,
    DockerHubRoutingModule
  ]
})
export class DockerHubModule { }
