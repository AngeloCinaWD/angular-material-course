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

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();

    if (view === "month") {
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
