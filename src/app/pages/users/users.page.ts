import { Component, inject, OnInit } from '@angular/core';
import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonSpinner,
} from '@ionic/angular/standalone';
import { LoadingController } from '@ionic/angular';
import { AppUserService } from 'src/app/services/app-user.service';
import { AppUser } from 'src/app/utils/interfaces';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
    standalone: true,
    imports: [IonFab, IonFabButton, IonIcon, RouterLink, IonSpinner],
})
export class UsersPage implements OnInit {
    private appUserService = inject(AppUserService);

    protected appUsers: AppUser[] = [];
    protected loading = true;

    constructor() {}

    async ngOnInit() {
        // alert('se va a mostrar el loading');
        // this.loading = await this.loadingController.create({
        //     message: 'Cargando usuarios...',
        //     spinner: 'circular',
        //     showBackdrop: true,
        // });
        // this.loading.present();
        this.loading = true;
        this.loadAppUsers();
    }

    async loadAppUsers() {
        try {
            this.appUserService.getAppUsers().subscribe((appUsers) => {
                this.appUsers = appUsers.sort((a, b) =>
                    a.nombres.localeCompare(b.nombres)
                );
                console.log(appUsers);
                this.loading = false;

                // alert('loading presentado');
                // this.loading.dismiss();
            });
        } catch (error) {
            this.loading = false;
            // this.loading.dismiss();
            console.error('Error loading photos:', error);
        }
    }
}
