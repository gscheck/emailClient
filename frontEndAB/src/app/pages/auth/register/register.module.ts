import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }