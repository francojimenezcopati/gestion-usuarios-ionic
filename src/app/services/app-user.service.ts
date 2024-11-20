import { inject, Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

// import { AuthService } from './auth.service';
import { AppUser } from '../utils/interfaces';
import { FirestoreCollections } from '../utils/Collections';

@Injectable({
    providedIn: 'root',
})
export class AppUserService {
    private firestore = inject(AngularFirestore);
    // private authService = inject(AuthService);

    constructor() {}

	public getAppUsers(){
        return this.firestore
            .collection<AppUser>(FirestoreCollections.APP_USERS)
            .valueChanges();
	}

    public async addAppUser(appUser: AppUser) {
        const docRef = this.firestore
            .collection(FirestoreCollections.APP_USERS)
            .doc();
        const id = docRef.ref.id;

        return docRef.set({ ...appUser, id });
    }
}
