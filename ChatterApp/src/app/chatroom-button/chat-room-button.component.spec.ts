import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomButtonComponent } from './chat-room-button.component';

describe('ChatroomButtonComponent', () => {
  let component: ChatRoomButtonComponent;
  let fixture: ComponentFixture<ChatRoomButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRoomButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRoomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
