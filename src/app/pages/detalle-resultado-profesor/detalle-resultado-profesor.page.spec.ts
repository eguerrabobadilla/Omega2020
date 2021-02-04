import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalleResultadoProfesorPage } from './detalle-resultado-profesor.page';

describe('DetalleResultadoProfesorPage', () => {
  let component: DetalleResultadoProfesorPage;
  let fixture: ComponentFixture<DetalleResultadoProfesorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleResultadoProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleResultadoProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
