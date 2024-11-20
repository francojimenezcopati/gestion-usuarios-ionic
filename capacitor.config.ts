import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.ionic.gestion',
    appName: 'Gestión de usuarios',
    webDir: 'www',
    plugins: {
        Keyboard: {
            resize: 'body', // Ajusta el body para que el contenido no quede tapado
            scrollAssist: true, // Habilita el desplazamiento asistido para inputs
            inputMode: 'resize', // Reorganiza el contenido cuando el teclado se abre
        },
    },
};

export default config;
