import { Component, inject, OnInit } from '@angular/core';
import {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonFabList,
	IonIcon
} from '@ionic/angular/standalone';
import { AddUserFormComponent } from 'src/app/components/add-user-form/add-user-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.page.html',
    styleUrls: ['./add-user.page.scss'],
    standalone: true,
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        AddUserFormComponent,
        IonButtons,
        IonBackButton,
        FormsModule,
        CommonModule,
        IonFab,
        IonFabButton,
        IonFabList,
		IonIcon,
		RouterLink
    ],
})
export class AddUserPage {
    constructor() {}
}
