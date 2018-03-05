import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeStructComponent } from './tree-struct.component';

describe('TreeStructComponent', () => {
  let component: TreeStructComponent;
  let fixture: ComponentFixture<TreeStructComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeStructComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeStructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
