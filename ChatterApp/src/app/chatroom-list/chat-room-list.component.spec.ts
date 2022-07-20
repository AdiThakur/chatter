import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomListComponent } from './chat-room-list.component';

describe('ChatroomListComponent', () => {
  let component: ChatRoomListComponent;
  let fixture: ComponentFixture<ChatRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRoomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
