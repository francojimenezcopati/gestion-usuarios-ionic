import { User } from '@angular/fire/auth';

export class UserDetails {
	uid: string;
    email: string;
    username: string;
    lastLogin: string;
    role: "guest" | "user" | "admin";

    constructor(authUser: User) {
        const dateString = authUser.metadata.lastSignInTime;
        const dateLastLogin = new Date(dateString as string);
		
		this.uid = authUser.uid;
        this.email = authUser.email!;
        this.username = authUser.displayName!;
        this.lastLogin = dateLastLogin.toString();
        this.role = "guest";
    }
}