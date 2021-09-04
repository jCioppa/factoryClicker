import { Component, Input, OnInit } from '@angular/core';
import { ResearchService } from 'src/app/services/ResearchService';

@Component({
  selector: 'ResearchStatistics',
  templateUrl: './research-statistics.component.html',
  styleUrls: ['./research-statistics.component.sass']
})
export class ResearchStatisticsComponent implements OnInit {

    constructor(public researchService: ResearchService) { 
      
    }

    ngOnInit(): void {
     
    }
}