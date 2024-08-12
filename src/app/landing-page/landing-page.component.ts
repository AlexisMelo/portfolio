import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit {
  /**
   * HTMLElement of main title element
   */
  @ViewChild("title") title?: ElementRef;

  /**
   * HTMLElement of main title element
   */
  @ViewChild("placeholder") placeholder?: ElementRef;

  /**
   * Content of main title
   */
  public titleContent: string = 'MELO.';

  /**
   * Timer reference to unsubscribe once finished
   */
  private typewriterInterval?: number;

  /**
   * Time for the typing effect in milliseconds
   */
  private typingDuration = 500;
  
  /**
   * Adds letter to position i at the title element
   * @param i 
   */
  private typewrite() {
    let i = 0;

    this.typewriterInterval = window.setInterval(() => {
      if (i >= this.titleContent.length || !this.title || !this.placeholder) {
        clearInterval(this.typewriterInterval);
        return;
      };
      this.title.nativeElement.innerHTML += this.titleContent.charAt(i);    
      this.placeholder.nativeElement.innerHTML = this.placeholder.nativeElement.innerHTML.substring(1);
      i++;
    }, this.typingDuration / this.titleContent.length);
  }

  /**
   * AfterViewInit implementation
   */
  ngAfterViewInit(): void {
    this.typewrite();
  }
}
