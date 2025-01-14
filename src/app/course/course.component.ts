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

  lessons: Lesson[] = [];

  isLoading: boolean = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  // per utilizzare il MatSort utilizziamo il ViewChild decorator type MatSort
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  displayedColumns: string[] = ["seqNo", "description", "duration"];

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];

    this.loadLessonsPage();
  }

  ngAfterViewInit() {
    // this.sort.sortChange.subscribe(console.log);

    // this.paginator.page
    //   .pipe(tap(() => this.loadLessonsPage()))
    //   .subscribe(console.log);

    // ogni volta che effettuo un sort riporto la pagina per la ricerca a 0
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // posso unire questi 2 observables ed ogni volta che uno emette un nuovo valore effettuo una chiamata verso il BE
    // utilizzo il merge() operator
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadLessonsPage()))
      .subscribe(console.log);
  }

  loadLessonsPage() {
    this.isLoading = true;

    this.coursesService
      .findLessons(
        this.course.id,
        // utilizzo il sort
        this.sort?.direction ?? "asc",
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 3,
        // aggiungiamo la colonna per il sorting
        this.sort?.active ?? "seqNo"
      )
      .pipe(
        tap((lessons) => (this.lessons = lessons)),
        catchError((err) => {
          console.log("Error loading lessons", err);
          alert("Error loading lessons");
          return throwError(err);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  prova(value) {
    console.log(value);
  }
}
