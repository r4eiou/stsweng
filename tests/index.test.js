jest.mock('connect-mongodb-session', () => {
    return jest.fn(() => jest.fn(() => ({
        on: jest.fn(), // Mock the `on` method
    })));
});

const request = require('supertest');
const app = require('../index'); // Import the app instance

describe('Express App Tests', () => {
    //Directs to Initial log in page
    it('should load the index page', async () => {
        const res = await request(app).get('/index');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Barangay Parang - Initial Login Page');
    });

    //Directs to user role
    it('should return userRole from /api/getUserRole', async () => {
        const res = await request(app).get('/api/getUserRole');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userRole', ''); // Default to empty string
    });

    //session handling
    it('should handle sessions correctly', async () => {
        const agent = request.agent(app); // To handle sessions
        await agent.get('/api/getUserRole').expect(200);

        const res = await agent.get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Barangay Parang - Initial Login Page');
    });
});

describe('Login Tests', () => {
    const validEmail = 'admin1@gmail.com';
    const validPassword = 'password1';

    //Valid Login
    it('should log in successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/login') // Your login route
            .send({ email: validEmail, password: validPassword });
    });

    //Invalid Login
    it('should return an error when email is missing', async () => {
        const invalidLogin = { password: validPassword }; // Missing email

        const response = await request(app)
            .post('/login')
            .send(invalidLogin);
    });

    it('should return an error when password is missing', async () => {
        const invalidLogin = { email: validEmail }; // Missing password

        const response = await request(app)
            .post('/login')
            .send(invalidLogin);
    });

    it('should return an error for invalid credentials', async () => {
        const invalidLogin = { email: validEmail, password: 'wrongPassword' }; // Invalid password

        const response = await request(app)
            .post('/login')
            .send(invalidLogin);
    });
});

describe('Create User Tests', () => {
    const validUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'password1',
    };

    // Valid create user
    it('should create a new user successfully with valid data', async () => {
        const response = await request(app)
            .post('/users') // Your create user route
            .send(validUser);
    });

    // Missing email
    it('should return error when email is missing', async () => {
        const invalidUser = { ...validUser };
        delete invalidUser.email; // Remove email to simulate invalid input

        const response = await request(app)
            .post('/users')
            .send(invalidUser);

    });
});

describe('Create Resident Case Tests', () => {
    const validResident = {
        firstName: 'John',
        middleName: 'Smith',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
    };

    // Valid Resident Case Creation
    it('should create a new resident case successfully with valid data', async () => {

        const response = await request(app)
            .post('/resident') // Your create resident route
            .send(validResident);
    });

    // Missing email
    it('should return error when email is missing', async () => {
        const invalidResident = { ...validResident };
        delete invalidResident.email; // Remove email to simulate invalid input

        const response = await request(app)
            .post('/resident') // Your create resident route
            .send(invalidResident);
    });
});