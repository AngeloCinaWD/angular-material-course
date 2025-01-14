import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  catchError,
  finalize,
} from "rxjs/operators";
import { merge, fromEvent, throwError } from "rxjs";
import { Lesson } from "../model/lesson";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
  standalone: false,
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course;

  // lessons è un array di lesson
  lessons: Lesson[] = [];

  // boolean property per mostrare o no lo spinner di caricamento
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  // nomi colenne per la tabella
  displayedColumns: string[] = ["seqNo", "description", "duration"];

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];

    // chiamo un metodo per fetchare le lessons dal DB
    this.loadLessonsPage();
  }

  ngAfterViewInit() {}

  loadLessonsPage() {
    // rendiamo visibile lo spinner di caricamento
    this.isLoading = true;

    // chiamo il metodo findLessons implementato nel service
    // devo passare alcuni parametri per filtrare le lezioni
    this.coursesService
      .findLessons(this.course.id, "asc", 0, 3)
      .pipe(
        // tramite tap operator assegno il valore ritornato dalla chiamata alla property lessons
        tap((lessons) => (this.lessons = lessons)),
        // gestisco gli eventuali errori
        catchError((err) => {
          console.log("Error loading lessons", err);
          alert("Error loading lessons");
          return throwError(err);
        }),
        // lo spinner di caricamento non si deve vedere alla fine della call http, qualunque sia la response, sia in caso di errore che di successo
        // per eesere sicuri di questo utilizziamo l'operatore finalize()
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  prova(value) {
    console.log(value);
  }
}
