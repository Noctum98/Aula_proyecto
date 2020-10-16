import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { IndexComponent } from './components/index/index.component';
import { CreateClassComponent } from './components/create-class/create-class.component';
import { DetailClassComponent } from './components/detail-class/detail-class.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskComponent } from './components/task/task.component';
import { AnswersComponent } from './components/answers/answers.component';
import { AnswerDetailComponent } from './components/answer-detail/answer-detail.component';
import { MembersComponent } from './components/members/members.component';

import { IdentityGuard } from './services/identity.guard';
import { TeacherGuard } from './services/teacher.guard';
import { MemberGuard } from './services/member.guard';


const appRoutes: Routes = [
    {path:'',component:IndexComponent,canActivate:[IdentityGuard]},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'error',component:ErrorComponent},
    {path:'index',component:IndexComponent,canActivate:[IdentityGuard]},
    {path:'create-class',component:CreateClassComponent,canActivate:[IdentityGuard]},
    {path:'detail-class/:id',component:DetailClassComponent,canActivate:[IdentityGuard]},
    {path:'create-task',component:CreateTaskComponent,canActivate:[TeacherGuard,MemberGuard,IdentityGuard]},
    {path:'task/:id',component:TaskComponent,canActivate:[MemberGuard,IdentityGuard]},
    {path:'answers/:task_id',component:AnswersComponent,canActivate:[TeacherGuard,MemberGuard,IdentityGuard]},
    {path:'answer/:answer_id',component:AnswerDetailComponent,canActivate:[MemberGuard,IdentityGuard]},
    {path:'members',component:MembersComponent,canActivate:[IdentityGuard]}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);

