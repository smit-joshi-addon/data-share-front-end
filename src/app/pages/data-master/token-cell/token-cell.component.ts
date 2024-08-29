import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-token-cell',
  templateUrl: './token-cell.component.html',
  styleUrls: ['./token-cell.component.scss']
})
export class TokenCellComponent {
  @Input() value: string;

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => alert('Copied to clipboard!'),
      (err) => console.error('Failed to copy text: ', err)
    );
  }
}
