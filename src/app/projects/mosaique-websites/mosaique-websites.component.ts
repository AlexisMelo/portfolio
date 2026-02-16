import { Component } from '@angular/core';
import { RangePipe } from 'src/app/shared/pipes/range.pipe';

@Component({
  selector: 'app-mosaique-websites',
  imports: [RangePipe],
  templateUrl: './mosaique-websites.component.html',
  styleUrl: './mosaique-websites.component.scss',
})
export class MosaiqueWebsitesComponent {}
