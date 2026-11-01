import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-image',
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent extends GridItemDirective {}
