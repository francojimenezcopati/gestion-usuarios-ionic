import { inject, Injectable, signal } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserDetails } from '../utils/UserDetails';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreCollections } from '../utils/Collections';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    firestore = inject(AngularFirestore);
    router = inject(Router);
    auth = inject(Auth);
    currentUserSig = signal<UserDetails | null | undefined>(undefined);

    constructor() {
        // Suscribirse a los cambios en el estado de autenticación
        this.auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                this.firestore // TARDA MAS, XQ RECUPERA DE FIRESTORE Y NO DEL AUTH DB
                    .doc(`${FirestoreCollections.USERS}/` + authUser.uid)
                    .get()
                    .subscribe((object) => {
                        this.currentUserSig.set({
                            ...(object.data() as UserDetails),
                            uid: authUser.uid,
                        });
                    });
                // Redireccionar si el usuario está autenticado
                // this.router.navigateByUrl('/home', { replaceUrl: true });
            } else {
                this.currentUserSig.set(null);
            }
        });
    }

    // Registro de usuarios
    public async register(email: string, username: string, password: string) {
        const promise = createUserWithEmailAndPassword(
            this.auth,
            email,
            password
        ).then((res) => {
            updateProfile(res.user, { displayName: username }).then(() => {
                this.createUser(res.user);
            });
        });
        return promise;
    }

    // Inicio de sesión
    public async login(email: string, password: string) {
        const promise = signInWithEmailAndPassword(this.auth, email, password);
        // promise.then((credentials) => {
        //     this.createUser(credentials.user);
        // });
        return promise;
    }

    private async createUser(authUser: User) {
        const userDetails = new UserDetails(authUser);
        const ref = this.firestore
            .collection(FirestoreCollections.USERS)
            .doc(authUser.uid);
        ref.set({ ...userDetails });
    }

    // Cierre de sesión
    logout() {
        return signOut(this.auth);
    }
}
