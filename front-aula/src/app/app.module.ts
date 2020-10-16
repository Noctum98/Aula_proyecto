import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {routing, appRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AngularFileUploaderModule } from "angular-file-uploader";

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { IndexComponent } from './components/index/index.component';
import { CreateClassComponent } from './components/create-class/create-class.component';
import { DetailClassComponent } from './components/detail-class/detail-class.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskComponent } from './components/task/task.component';
import { AnswerComponent } from './components/answer/answer.component';
import { AnswersComponent } from './components/answers/answers.component';
import { AnswerDetailComponent } from './components/answer-detail/answer-detail.component';
import { MembersComponent } from './components/members/members.component';
import { IdentityGuard } from './services/identity.guard';
import { UserService } from './services/user.service';
import { ClassroomService } from './services/classroom.service';
import { MemberService } from './services/member.service';
import { TeacherGuard } from './services/teacher.guard';
import { MemberGuard } from './services/member.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent,
    IndexComponent,
    CreateClassComponent,
    DetailClassComponent,
    CreateTaskComponent,
    TaskComponent,
    AnswerComponent,
    AnswersComponent,
    AnswerDetailComponent,
    MembersComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    AngularFileUploaderModule
  ],
  providers: [
    appRoutingProviders,
    IdentityGuard,
    TeacherGuard,
    MemberGuard,
    UserService,
    ClassroomService,
    MemberService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
