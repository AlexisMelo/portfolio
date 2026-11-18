import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { ExperienceKind } from '../../experience-kind.model';

/**
 * What the description dialog shows
 */
export interface ExperienceDescriptionDialogData {
  /**
   * Name of the step, shown as the title
   */
  title: string;

  /**
   * Whole description of the step
   */
  description: string;

  /**
   * Kind of the step, which gives the colour of the title band
   */
  kind: ExperienceKind;
}

/**
 * Id of the dialog title, which names the dialog for screen readers
 */
export const EXPERIENCE_DESCRIPTION_DIALOG_TITLE_ID =
  'experience-description-dialog-title';

/**
 * Dialog showing the whole description of a step of the path, cut on its card, under a band in the
 * colour of the card with the name of the step
 */
@Component({
  selector: 'app-experience-description-dialog',
  imports: [ActionButtonComponent, TranslocoPipe],
  templateUrl: './experience-description-dialog.component.html',
  styleUrl: './experience-description-dialog.component.scss',
  host: {
    'animate.enter': 'dialog-enter',
    '[class.school]': "data.kind === 'school'",
  },
})
export class ExperienceDescriptionDialogComponent {
  /**
   * Title, text and kind of the step
   */
  protected readonly data =
    inject<ExperienceDescriptionDialogData>(DIALOG_DATA);

  /**
   * Id of the title
   */
  protected readonly TITLE_ID = EXPERIENCE_DESCRIPTION_DIALOG_TITLE_ID;

  /**
   * Reference of the opened dialog
   */
  private readonly dialogRef = inject(DialogRef);

  /**
   * Closes the dialog
   */
  protected close() {
    this.dialogRef.close();
  }
}
