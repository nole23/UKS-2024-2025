export class DockerHub {
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DockerHubComponent } from './docker-hub.component';

const routes: Routes = [{ path: '', component: DockerHubComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerHubRoutingModule { }