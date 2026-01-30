import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [RouterModule, TranslateModule],
    template: `
      <div>
        <h1>404</h1>
        <h2>{{'404.ERROR' | translate}}</h2>
      </div>
    `
})
export class PageNotFoundComponent {}