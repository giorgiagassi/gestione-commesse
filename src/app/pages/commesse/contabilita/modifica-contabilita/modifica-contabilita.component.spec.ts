import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaContabilitaComponent } from './modifica-contabilita.component';

describe('ModificaContabilitaComponent', () => {
  let component: ModificaContabilitaComponent;
  let fixture: ComponentFixture<ModificaContabilitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificaContabilitaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModificaContabilitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
