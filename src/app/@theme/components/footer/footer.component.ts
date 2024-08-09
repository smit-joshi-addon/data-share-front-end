import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b><a href="#" target="_blank">Smit Joshi</a></b> 2024
    </span>
  `,
})
export class FooterComponent {
}
