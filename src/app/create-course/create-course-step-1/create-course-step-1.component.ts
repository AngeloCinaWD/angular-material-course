import { Component } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";

@Component({
  selector: "create-course-step-1",
  templateUrl: "create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"],
  standalone: false,
})
export class CreateCourseStep1Component {
  form = this.fb.group({
    title: [
      "",
      [Validators.required, Validators.minLength(5), Validators.maxLength(60)],
    ],
    // valore di default data di oggi
    releasedAt: [new Date(), Validators.required],
    // non voglio passare un valore di default
    // category: ["BEGINNER", Validators.required],
    category: ["", Validators.required],
    courseType: ["premium", Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: ["", [Validators.required, Validators.minLength(3)]],
  });

  startDate: Date = new Date(1990, 0, 1);

  // implementiamo una funzione che ci permetta di evidenziare alcuni giorni nel calendar
  // va ad applicare del css, quindi le classi css che vogliamo applicare vanno implemetate nel .css
  // vogliamo evidenziare tutti i primi del mese
  // utilizziamo MatCalendarCellClassFunction un afunziona che genera classi per il calendar, questa ha 2 argomenti, il primo è un oggetto Date (in questo caso la data è data da un oggetto JS Date) ed un'altro è la view del datepicker (può essere il mese, l'anno etc)
  // la funzione viene chiamata per ogni singola cella della view del datepicker ed il valore della cella è dato da cellDate
  // per applicare questa function si utilizza nel mat-datepicker attraverso la proprietà [dateClass]="dateClass"
  // la classe css va messa in uno style globale ad esempio in styles.scss, oppure utlizzare ::ng-deep
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();

    console.log(date);

    if (view === "month") {
      // posso mettere più classi "highlight-date seconda terza etc""
      return date === 1 ? "highlight-date" : "";
    }

    return "";
  };

  constructor(private fb: UntypedFormBuilder) {}

  // GETTERS il getter dell'input viene chiamato sempre, senza dover richiamare il metodo nel template
  // quello del radio-button e del select no, solo se lo richiamo nel template

  get courseTitle() {
    // console.log(this.form.controls["title"]);
    return this.form.controls["title"];
  }

  get courseType() {
    // console.log(this.form.controls["courseType"]);
    return this.form.controls["courseType"];
  }

  get category() {
    // console.log(this.form.controls["category"]);
    return this.form.controls["category"];
  }

  get releasedAt() {
    return this.form.controls["releasedAt"];
  }
}
