import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DockerHubComponent } from "./docker-hub.component";

describe('DockerHubComponent', () => {
    let component: DockerHubComponent;
    let fixture: ComponentFixture<DockerHubComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [DockerHubComponent]  // Dodajemo FooterComponent u declarations
      })
      .compileComponents();
  
      fixture = TestBed.createComponent(DockerHubComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
