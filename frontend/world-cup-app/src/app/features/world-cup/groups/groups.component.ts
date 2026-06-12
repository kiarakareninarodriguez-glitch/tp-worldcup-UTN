import { Component, OnInit } from '@angular/core';
import { GroupsService } from './service/groups.service';
import { GroupsViewModel } from './model/groups-view-model.interface';

@Component({
  selector: 'app-groups-page',
  standalone: false,
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsPageComponent implements OnInit {

  constructor(private readonly groupsService: GroupsService) {}

  get pageState(): GroupsViewModel {
    return this.groupsService.getViewModel();
  }

  ngOnInit(): void {
    this.groupsService.initialize();
  }

  onSelectGroup(groupId: string): void {
    this.groupsService.selectGroup(groupId);
  }
}