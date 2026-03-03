import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from 'src/app/shared/language.service';

@Component({
  selector: 'app-language-selector',
  imports: [UpperCasePipe],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'languageService.toggle()',
    '(keydown.enter)': 'languageService.toggle()',
    '(keydown.space)': '$event.preventDefault(); languageService.toggle()',
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]':
      'languageService.currentLang() === "fr" ? "Switch to English" : "Passer en français"',
  },
})
export class LanguageSelectorComponent {
  public languageService = inject(LanguageService);
}
