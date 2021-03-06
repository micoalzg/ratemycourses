import { CoursesService } from "src/app/_services/courses.service";
import { EditCoursesComponent } from "./edit-courses/edit-courses.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { MatDialog } from "@angular/material";
import { UsersService, User } from "./../_services/users.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Subscription, Observable } from "rxjs";
import { LoginService } from "../_services/login.service";
import { ReviewService, Review } from "../_services/review.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NewCourseComponent } from "../new-course/new-course.component";
import { NewReviewComponent } from "../new-review/new-review.component";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.scss"]
})
export class UserDashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards: any;
  user: User;
  userReviews: Review[];

  editing = false;
  origReview: Review;

  title = ["title", "data"];

  courseDescMap: Object = {};

  userSessionSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private userService: UsersService,
    private matDialog: MatDialog,
    private router: Router,
    public courseService: CoursesService
  ) {
    this.route.params.subscribe(params => {
      this.userService
        .getUserByUsername(localStorage.getItem("username"))
        .subscribe(res => {
          this.user = res;
          this.reviewService
            .getReviewsByUser(this.user.username)
            .subscribe(reviews => {
              this.userReviews = reviews;
              this.setCards();

              console.log(this.userReviews);
              console.log(this.user);
            });
        });
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService
        .getUserByUsername(localStorage.getItem("username"))
        .subscribe(res => {
          this.user = res;
          this.user.courses.forEach(course => {
            this.courseService.getCourse(course).subscribe(courseObj => {
              this.courseDescMap[course] = courseObj.courseName;
            });
          });
          this.user.takenCourses.forEach(course => {
            this.courseService.getCourse(course).subscribe(courseObj => {
              this.courseDescMap[course] = courseObj.courseName;
            });
          });
          this.reviewService
            .getReviewsByUser(this.user.username)
            .subscribe(reviews => {
              this.userReviews = reviews;
              console.log(this.userReviews);
              console.log(this.user);
              this.setCards();
            });
        });
    });
  }

  setCards() {
    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        const userData = [
          { title: "Username", data: this.user.username },
          { title: "Year", data: this.user.yearOfStudy },
          { title: "Banned", data: this.user.banned ? "Yes" : "No" }
        ];

        if (matches) {
          return [
            {
              title: "User Info",
              cols: 4,
              rows: 1,
              cardData: { user: this.user, tableData: userData }
            },
            {
              title: "Courses",
              cols: 4,
              rows: 2,
              cardData: {
                currentlyTaking: this.user.courses,
                taken: this.user.takenCourses
              }
            },
            {
              title: "All Reviews",
              cols: 4,
              rows: 3,
              cardData: { allReviews: this.userReviews }
            }
          ];
        }

        return [
          {
            title: "User Info",
            cols: 2,
            rows: 1,
            cardData: { user: this.user, tableData: userData }
          },
          {
            title: "All Reviews",
            cols: 2,
            rows: 3,
            cardData: { allReviews: this.userReviews }
          },
          {
            title: "Courses",
            cols: 2,
            rows: 2,
            cardData: {
              currentlyTaking: this.user.courses,
              taken: this.user.takenCourses
            }
          }
        ];
      })
    );
  }

  edit(section: string) {
    if (section === "User Info") {
      this.matDialog
        .open(EditProfileComponent, {
          data: this.user,
          width: "500px"
        })
        .afterClosed()
        .subscribe(res => {
          console.log(res);
          this.ngOnInit();
        });
    } else if (section === "Courses") {
      this.matDialog.open(EditCoursesComponent, {
        data: this.user,
        width: "500px"
      }).afterClosed().subscribe(res => {
        this.ngOnInit();
      });
    }
    console.log(section);
  }

  editReview(review: Review) {
    console.log(review);
    review['isNew'] = false;
    this.matDialog
      .open(NewReviewComponent, {
        data: review,
        width: "500px"
      })
      .afterClosed()
      .subscribe(res => {
        console.log(res);
        this.ngOnInit();
      });
  }

  saveReview(review: Review) {
    this.reviewService.saveReview(review);
    this.editing = false;
  }

  cancelChange(review: Review) {
    this.editing = false;
  }

  removeReview(review: Review) {
    console.log(review);
    this.reviewService.deleteReview(review);
    this.ngOnInit();
    this.editing = false;
  }

  reset() {
    this.editing = false;
  }

  viewCourse(course: string) {
    this.router.navigate(["/view-reviews/" + course]);
  }

  getCourseDescription(course: string) {}
}
