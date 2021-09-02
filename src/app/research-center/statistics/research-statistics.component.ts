import { Component, Input, OnInit } from '@angular/core';
import { ResearchService } from 'src/factoryClicker/ResearchCenter';

@Component({
  selector: 'ResearchStatistics',
  templateUrl: './research-statistics.component.html',
  styleUrls: ['./research-statistics.component.sass']
})
export class ResearchStatisticsComponent implements OnInit {
    @Input() researchService?: ResearchService;
    ngOnInit(): void {
      if (!this.researchService) { 
        throw new Error("invalid params")
      }
    }
}