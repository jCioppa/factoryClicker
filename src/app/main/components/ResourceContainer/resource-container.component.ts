import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceType } from 'src/factoryClicker/ResourceType';

@Component({
  selector: 'ResourceContainer',
  templateUrl: './resource-container.component.html',
  styleUrls: ['./resource-container.component.sass'],
})
export class ResourceContainerComponent implements OnInit {
  @Input() public resourceType?: ResourceType;
  @Input() public displayName?: string;
  @Input() public resourceSource?: any;

  @Output() onClick = new EventEmitter<ResourceType>();

  ngOnInit(): void {}

  onClickResource(): void {
    this.onClick.emit(this.resourceType);
  }
}
