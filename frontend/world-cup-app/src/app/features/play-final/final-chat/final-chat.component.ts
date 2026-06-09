import { Component, OnInit } from '@angular/core';
import { FinalChatViewModel } from './model/final-chat-view-model.interface';
import { FinalChatService } from './service/final-chat.service';

@Component({
  selector: 'app-final-chat-page',
  standalone: false,
  templateUrl: './final-chat.component.html',
  styleUrls: ['./final-chat.component.css'],
})
export class FinalChatPageComponent implements OnInit {
  constructor(private readonly pageService: FinalChatService) {}

  get pageState(): FinalChatViewModel {
    return this.pageService.getViewModel();
  }

  ngOnInit(): void {
    this.pageService.initialize();
  }
}