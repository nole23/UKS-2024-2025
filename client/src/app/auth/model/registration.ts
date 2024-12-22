export class Registration {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    againPassword: string;

    constructor(
        email: string,
        username: string,
        firstName: string,
        lastName: string,
        password: string,
        againPassword: string
    ) {
        this.email = email;
        this.username = username;
        this.first_name = firstName;
        this.last_name = lastName;
        this.password = password;
        this.againPassword = againPassword;
    }

    // Validacija email-a
    isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Validacija username-a (minimalna dužina 3 karaktera)
    isValidUsername(username: string): boolean {
        return username.length >= 3;
    }

    // Validacija imena i prezimena
    isValidName(name: string): boolean {
        return name.trim().length > 0;
    }

    // Validacija lozinke (minimalna dužina 6 karaktera)
    isValidPassword(password: string): boolean {
        const minLength = 6;
        return password.length >= minLength;
    }

    // Validacija ponovljene lozinke
    doPasswordsMatch(): boolean {
        return this.password === this.againPassword;
    }

    // Metoda za validaciju cele registracije
    isValid(): boolean {
        // Provera da li je email validan
        if (!this.email || !this.isValidEmail(this.email)) {
            console.error('Invalid email address.');
            return false;
        }

        // Provera da li je username validan
        if (!this.username || !this.isValidUsername(this.username)) {
            console.error('Username must be at least 3 characters long.');
            return false;
        }

        // Provera da li je ime validno
        if (!this.first_name || !this.isValidName(this.first_name)) {
            console.error('First name cannot be empty.');
            return false;
        }

        // Provera da li je prezime validno
        if (!this.last_name || !this.isValidName(this.last_name)) {
            console.error('Last name cannot be empty.');
            return false;
        }

        // Provera da li je lozinka validna
        if (!this.password || !this.isValidPassword(this.password)) {
            console.error('Password must be at least 6 characters long.');
            return false;
        }

        // Provera da li lozinke odgovaraju
        if (!this.doPasswordsMatch()) {
            console.error('Passwords do not match.');
            return false;
        }

        // Ako su sve provere prošle, registracija je validna
        return true;
    }
}
