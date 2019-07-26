import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenlistComponent } from './tokenlist.component';

describe('TokenlistComponent', () => {
  let component: TokenlistComponent;
  let fixture: ComponentFixture<TokenlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
