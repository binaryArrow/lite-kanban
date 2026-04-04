import {describe, beforeEach, it, expect, vi} from 'vitest';
import {BoardComponent} from './board.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DbService} from '../services/db.service';
import {BoardService} from '../services/board.service';
import {signal} from '@angular/core';
import {TicketContainerModel} from '../../models/TicketContainerModel';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  const mockDbService = {
    addNewTicketContainer: vi.fn(),
  };

  const mockBoardService = {
    containers: signal<TicketContainerModel[]>([]),
    selectedProject: signal({id: 1, title: 'Test Project'}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [
        {provide: DbService, useValue: mockDbService},
        {provide: BoardService, useValue: mockBoardService},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create an empty container when clicking the add button', async () => {
    const newContainer: TicketContainerModel = {id: 1, title: 'NEW', projectId: 1, order: 0};
    mockDbService.addNewTicketContainer.mockResolvedValue(newContainer);

    const button = fixture.nativeElement.querySelector('[data-testid="add-container-btn"]');
    expect(button).toBeTruthy();
    button.click();
    await fixture.whenStable();

    expect(mockDbService.addNewTicketContainer).toHaveBeenCalledWith(1, 0);
    expect(mockBoardService.containers().length).toBe(1);
    expect(mockBoardService.containers()[0]).toEqual(newContainer);
  });
});
