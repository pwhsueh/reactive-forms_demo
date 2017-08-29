import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <h1>Reactive Forms</h1>
    <hero-detail></hero-detail>
  </div>`
})
export class AppComponent {
  title = 'app works!';
}
