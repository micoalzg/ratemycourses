import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SearchCourseComponent } from './search-course/search-course.component';
import { MyRatingsComponent } from 'src/app/my-ratings/my-ratings.component';

  const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'search-course', component: SearchCourseComponent},
    {path: 'my-ratings', component: MyRatingsComponent},
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
