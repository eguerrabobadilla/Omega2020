import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeleccionUnaRespuestaComponent } from './seleccion-una-respuesta.component';

describe('SeleccionUnaRespuestaComponent', () => {
  let component: SeleccionUnaRespuestaComponent;
  let fixture: ComponentFixture<SeleccionUnaRespuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionUnaRespuestaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionUnaRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
