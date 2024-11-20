export interface UserPhoto {
    id: string;
    userId: string;
    url: string;
}

export interface AppUser {
    id?: string;
    imageUrl: string;
    nombres: string;
    apellidos: string;
    dni: number;
    correo: string;
    clave: string;
}
