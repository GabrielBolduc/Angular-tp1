import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [RouterModule],
    template: `
      <div>
        <h1>404</h1>
        <h2>Page not found</h2>
      </div>
    `
})
export class PageNotFoundComponent {}