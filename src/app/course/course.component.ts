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

  // per far funzionare il paginator dobbiamo intercettare gli events che questo genera al click dei suoi componenti
  // per farlo, la cosa migliore è utilizzare il ViewChild per creare una template reference
  // la property è di tipo MatPaginator component, indichiamo ad angular tramite ViewChild di afferrare la prima istanza MatPaginator nel componente
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  displayedColumns: string[] = ["seqNo", "description", "duration"];

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];

    this.loadLessonsPage();
  }

  // per utilizzare una template reference dobbiamo essere sicuri che il componente sia renderizzato
  // quindi non possiamo richiamarlo nell'OnInit ma per forza qui nell'AfterViewInit
  ngAfterViewInit() {
    // il paginator emette un evento PageEvent con tutte le info necessarie alla corretta impaginazione
    // emette un observable
    this.paginator.page
      .pipe(
        // come side effect dobbiamo effettuare una call http verso il BE con le info per caricare le giuste lessons
        // non passiamo nessun valore qui perchè possiamo accedere al paginator direttamente nel metodo che chiamiamo
        tap(() => this.loadLessonsPage())
      )
      .subscribe(console.log);
  }

  loadLessonsPage() {
    this.isLoading = true;

    // accedendo al paginator dobbiamo fare attenzione perchè quando questo meotodo è richiamato nell'OnInit non esiste ancora l'oggetto paginator
    // quindi utilizziamo l'Elvis operator (in js è il nullish coalescing ??) e l'operatore Optional chaining (?.) ed indichiamo un valore di default
    this.coursesService
      .findLessons(
        this.course.id,
        "asc",
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 3
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
