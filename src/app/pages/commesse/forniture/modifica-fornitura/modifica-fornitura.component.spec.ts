import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaFornituraComponent } from './modifica-fornitura.component';

describe('ModificaFornituraComponent', () => {
  let component: ModificaFornituraComponent;
  let fixture: ComponentFixture<ModificaFornituraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificaFornituraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModificaFornituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
