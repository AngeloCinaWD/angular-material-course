import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.css"],
  standalone: false,
})
export class CoursesCardListComponent implements OnInit {
  // property che riceve tutti i corsi di una determinata categoria
  @Input()
  courses: Course[];

  constructor() {}

  ngOnInit() {}

  editCourse(course: Course) {}
}
