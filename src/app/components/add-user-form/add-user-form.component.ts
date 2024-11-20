import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonNote,
    IonInputPasswordToggle,
    IonInput,
    IonButton,
    AlertController,
    IonFab,
    IonFabButton,
    IonSpinner,
} from '@ionic/angular/standalone';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { PhotoService } from 'src/app/services/photo.service';
import { AppUser } from 'src/app/utils/interfaces';
import { AppUserService } from 'src/app/services/app-user.service';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

@Component({
    selector: 'app-add-user-form',
    standalone: true,
    templateUrl: './add-user-form.component.html',
    styleUrls: ['./add-user-form.component.scss'],
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        IonInput,
        IonNote,
        IonInputPasswordToggle,
        IonButton,
        IonFab,
        IonFabButton,
        IonSpinner,
    ],
})
export class AddUserFormComponent {
    private fb = inject(FormBuilder);
    private qrscannerService = inject(QrscannerService);
    private alertController = inject(AlertController);
    private photoService = inject(PhotoService);
    private appUserService = inject(AppUserService);

    protected userImage = '/assets/DefaultUser.png';
    private currentAppUserList: AppUser[] = [];
    private content: string[] = [];
    protected loading = false;

    credentials: FormGroup;

    constructor() {
        Keyboard.setResizeMode({ mode: KeyboardResize.Native });
        this.loading = false;
        this.credentials = this.fb.group(
            {
                apellidos: ['', Validators.required],
                nombres: ['', Validators.required],
                dni: [
                    '',
                    [
                        Validators.required,
                        Validators.min(10000000),
                        Validators.max(99999999),
                    ],
                ],
                correo: ['', [Validators.required, Validators.email]],
                clave1: ['', Validators.required],
                clave2: ['', Validators.required],
            },
            { validator: this.passwordMatchValidator }
        );

        this.appUserService.getAppUsers().subscribe((appUsers) => {
            this.currentAppUserList = appUsers;
        });
    }

    get apellidos() {
        return this.credentials.get('apellidos');
    }

    get nombres() {
        return this.credentials.get('nombres');
    }

    get dni() {
        return this.credentials.get('dni');
    }

    get correo() {
        return this.credentials.get('correo');
    }

    get clave1() {
        return this.credentials.get('clave1');
    }

    get clave2() {
        return this.credentials.get('clave2');
    }

    async onScanClick() {
        const result = await this.qrscannerService.startScan();
        if (result === null) {
            this.showAlert('Error', 'No se ha escaneado el código de barras');
        } else {
            this.content = result.split('@');

            const nombres = this.content[2].split(' ');
            const apellidos = this.content[1].split(' ');

            if (nombres.length > 1) {
                this.nombres?.setValue(
                    `${
                        nombres[0].charAt(0) + nombres[0].slice(1).toLowerCase()
                    } ${
                        nombres[1].charAt(0) + nombres[1].slice(1).toLowerCase()
                    }`
                );
            } else {
                this.nombres?.setValue(
                    `${
                        nombres[0].charAt(0) + nombres[0].slice(1).toLowerCase()
                    }`
                );
            }
            if (apellidos.length > 1) {
                this.apellidos?.setValue(
                    `${
                        apellidos[0].charAt(0) +
                        apellidos[0].slice(1).toLowerCase()
                    } ${
                        apellidos[1].charAt(0) +
                        apellidos[1].slice(1).toLowerCase()
                    }`
                );
            } else {
                this.apellidos?.setValue(
                    `${
                        apellidos[0].charAt(0) +
                        apellidos[0].slice(1).toLowerCase()
                    }`
                );
            }

            this.dni?.setValue(this.content[4]);
        }
    }

    async onTakePhotoClick() {
        this.userImage = await this.photoService.takePhoto();
    }

    async addUser() {
        const isEmailTaken = this.checkIfEmailsIsTaken(this.correo?.value);
        if (isEmailTaken) {
            this.showAlert(
                'Error',
                'El correo ingresado ya pertenece a otro usuario'
            );
            return;
        }

        this.loading = true;

        const url = await this.photoService.uploadPhoto(this.userImage);
        if (url === null) {
            this.loading = false;
            this.showAlert('Error', 'Ha ocurrido un error');
            return;
        }

        const newAppUser: AppUser = {
            imageUrl: url,
            nombres: this.nombres?.value,
            apellidos: this.apellidos?.value,
            correo: this.correo?.value,
            dni: this.dni?.value,
            clave: this.clave1?.value,
        };

        console.log(newAppUser);

        await this.appUserService.addAppUser(newAppUser);

        this.loading = false;

        this.credentials.reset();
        this.userImage = '/assets/DefaultUser.png';
        this.showAlert(
            'Usuario añadido',
            '¡Usuario añadido a la base de datos con éxito!'
        );
    }

    private checkIfEmailsIsTaken(email: string) {
        return this.currentAppUserList.some(
            (appUser) => appUser.correo === email
        );
    }

    private async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Vale'],
            cssClass: 'custom-alert-class',
        });
        await alert.present();
    }

    passwordMatchValidator(group: AbstractControl) {
        const clave1 = group.get('clave1')?.value;
        const clave2 = group.get('clave2')?.value;

        if (clave1 !== clave2 || clave2 === '') {
            group.get('clave2')?.setErrors({ mismatch: true });
        } else {
            group.get('clave2')?.setErrors(null); // Elimina el error si coinciden
        }
    }
}
