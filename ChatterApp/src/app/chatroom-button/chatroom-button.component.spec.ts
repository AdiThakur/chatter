import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomButtonComponent } from './chatroom-button.component';

describe('ChatroomButtonComponent', () => {
  let component: ChatroomButtonComponent;
  let fixture: ComponentFixture<ChatroomButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatroomButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatroomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
