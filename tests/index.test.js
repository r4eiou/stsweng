jest.mock('connect-mongodb-session', () => {
    return jest.fn(() => jest.fn(() => ({
        on: jest.fn(), // Mock the `on` method
    })));
});

const request = require('supertest');
const app = require('../index'); // Import the app instance

describe('Express App Tests', () => {
    //Directs to user role
    it('should return userRole from /api/getUserRole', async () => {
        const res = await request(app).get('/api/getUserRole');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userRole', ''); // Default to empty string
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

describe('Create Events Tests', () => {
    const validEvent = {
        headline: 'Community Feast',
        startDate: '2024-12-01',
        finalDate: '2024-12-05',
        details: 'A week-long celebration of the community with various activities.',
    };

    // Valid Event Case Creation
    it('should create a new event successfully with valid data', async () => {
        const response = await request(app)
            .post('/events') // Your create event route
            .send(validEvent);
    });

    // Missing Headline
    it('should return error when headline is missing', async () => {
        const invalidEvent = { ...validEvent };
        delete invalidEvent.headline; // Remove headline to simulate invalid input

        const response = await request(app)
            .post('/events') // Your create event route
            .send(invalidEvent);
    });

    // Invalid Start Date Format
    it('should return error when start date is in an invalid format', async () => {
        const invalidEvent = { ...validEvent, startDate: 'invalid-date-format' };

        const response = await request(app)
            .post('/events') // Your create event route
            .send(invalidEvent);
    });

    // Final Date Before Start Date
    it('should return error when final date is earlier than start date', async () => {
        const invalidEvent = { ...validEvent, finalDate: '2024-11-30' }; // Final date before start date

        const response = await request(app)
            .post('/events') // Your create event route
            .send(invalidEvent);
    });

    // Missing Details
    it('should return error when details are missing', async () => {
        const invalidEvent = { ...validEvent };
        delete invalidEvent.details; // Remove details to simulate invalid input

        const response = await request(app)
            .post('/events') // Your create event route
            .send(invalidEvent);
    });
});