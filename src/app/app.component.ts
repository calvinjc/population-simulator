import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {}

  headerBtnClick() {
    // scroll the .content-container into view
    const contentContainer = document.querySelector('.welcome-container');
    if (contentContainer) {
      contentContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }
}