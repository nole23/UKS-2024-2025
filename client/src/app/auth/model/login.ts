export class Login {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        // Validacija email-a i password-a u konstruktoru
        this.email = this.isValidEmail(email) ? email : '';
        this.password = this.isValidPassword(password) ? password : '';
    }

    // Validacija email-a
    isValidEmail(email: string): boolean {
        // Regex za email validaciju
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Validacija password-a
    isValidPassword(password: string): boolean {
        // Password validacija: minimalna dužina 6 karaktera
        const minLength = 6;
        return password.length >= minLength;
    }

    // Metoda za proveru ispravnosti email-a i password-a
    isValid(): boolean {
        if (!this.email || !this.isValidEmail(this.email)) {
            console.error('Email is not valid');
            return false;
        }

        if (!this.password || !this.isValidPassword(this.password)) {
            console.error('Password is too short (min. 6 characters)');
            return false;
        }

        return true;
    }
}
