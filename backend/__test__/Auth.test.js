const auth = require('../auth');
const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock the database module
jest.mock('../database');

describe('Auth Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('successfully registers a new user', async () => {
            const mockUser = {
                user_id: 1,
                username: 'testuser',
                email: 'test@gmail.com'
            };
            
            db.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await auth.registerUser('testuser', 'password123', 'test@gmail.com');
            
            expect(result).toEqual(mockUser);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('throws error when username/email already exists', async () => {
            db.query.mockRejectedValueOnce({ code: '23505' });

            await expect(auth.registerUser('existing', 'password123', 'test@gmail.com'))
                .rejects.toThrow('Username or email already exists');
        });

        it('throws error when input exceeds maximum length', async () => {
            const longUsername = 'a'.repeat(51);
            
            await expect(auth.registerUser(longUsername, 'password123', 'test@gmail.com'))
                .rejects.toThrow('Input exceeds maximum length');
        });

        it('throws error when database query fails', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));
        
            await expect(auth.registerUser('testuser', 'password123', 'test@gmail.com'))
                .rejects.toThrow('Database error');
        });

        it('trims username and email before inserting into the database', async () => {
            const mockUser = { user_id: 1, username: 'testuser', email: 'test@gmail.com' };
            
            db.query.mockResolvedValueOnce({ rows: [mockUser] });
        
            await auth.registerUser('   testuser   ', 'password123', '   test@gmail.com   ');
        
            expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser', expect.any(String), 'test@gmail.com']);
        });
    });

    describe('loginUser', () => {
        it('successfully logs in a user', async () => {
            const mockUser = {
                user_id: 1,
                email: 'test@test.com',
                password: await bcrypt.hash('password123', 10)
            };

            db.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await auth.loginUser('test@gmail.com', 'password123');

            expect(result).toHaveProperty('token');
            expect(result.email).toBe(mockUser.email);
            expect(result.user_id).toBe(mockUser.user_id);
        });

        it('throws error when user not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(auth.loginUser('nonexistent@test.com', 'password123'))
                .rejects.toThrow('User not found');
        });

        it('throws error when password is invalid', async () => {
            const mockUser = {
                user_id: 1,
                email: 'test@test.com',
                password: await bcrypt.hash('password123', 10)
            };

            db.query.mockResolvedValueOnce({ rows: [mockUser] });

            await expect(auth.loginUser('test@test.com', 'wrongpassword'))
                .rejects.toThrow('Invalid password');
        });

        it('throws error when database query fails', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));
        
            await expect(auth.loginUser('test@gmail.com', 'password123'))
                .rejects.toThrow('Database error');
        });

        it('trims and converts email to lowercase before querying', async () => {
            const mockUser = { user_id: 1, email: 'test@gmail.com', password: await bcrypt.hash('password123', 10) };
        
            db.query.mockResolvedValueOnce({ rows: [mockUser] });
        
            await auth.loginUser('   TEST@GMAIL.COM   ', 'password123');
        
            expect(db.query).toHaveBeenCalledWith(expect.any(String), ['test@gmail.com']);
        });

        it('throws error if JWT signing fails', async () => {
            const mockUser = { user_id: 1, email: 'test@gmail.com', password: await bcrypt.hash('password123', 10) };
        
            db.query.mockResolvedValueOnce({ rows: [mockUser] });
            jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error('JWT error'); });
        
            await expect(auth.loginUser('test@gmail.com', 'password123'))
                .rejects.toThrow('JWT error');
        });  
    });

    describe('forgetPassword', () => {
        it('successfully updates password', async () => {
            const mockUser = {
                user_id: 1,
                password: await bcrypt.hash('currentPassword', 10)
            };

            db.query.mockResolvedValueOnce({ rows: [mockUser] }); // Fetch query
            db.query.mockResolvedValueOnce({ rows: [] }); // Update query

            const result = await auth.forgetPassword(
                'testuser',
                'test@gmail.com',
                'currentPassword',
                'newPassword123'
            );

            expect(result.message).toBe('Password updated successfully');
            expect(db.query).toHaveBeenCalledTimes(2);
        });

        it('throws error when user not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(auth.forgetPassword(
                'nonexistent',
                'test@gmail.com',
                'currentPassword',
                'newPassword123'
            )).rejects.toThrow('User not found');
        });

        it('throws error when current password is incorrect', async () => {
            const mockUser = {
                user_id: 1,
                password: await bcrypt.hash('currentPassword', 10)
            };

            db.query.mockResolvedValueOnce({ rows: [mockUser] });

            await expect(auth.forgetPassword(
                'testuser',
                'test@gmail.com',
                'wrongPassword',
                'newPassword123'
            )).rejects.toThrow('Current password is incorrect');
        });

        it('throws error when database query fails while fetching user', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));
        
            await expect(auth.forgetPassword('testuser', 'test@gmail.com', 'currentPassword', 'newPassword123'))
                .rejects.toThrow('Database error');
        });

        it('throws error when database query fails while updating password', async () => {
            const mockUser = { user_id: 1, password: await bcrypt.hash('currentPassword', 10) };
        
            db.query.mockResolvedValueOnce({ rows: [mockUser] });
            db.query.mockRejectedValueOnce(new Error('Database update error'));
        
            await expect(auth.forgetPassword('testuser', 'test@gmail.com', 'currentPassword', 'newPassword123'))
                .rejects.toThrow('Database update error');
        });

        it('trims and converts email to lowercase before querying', async () => {
            const mockUser = { user_id: 1, password: await bcrypt.hash('currentPassword', 10) };
        
            db.query.mockResolvedValueOnce({ rows: [mockUser] });
        
            await auth.forgetPassword('testuser', '   TEST@GMAIL.COM   ', 'currentPassword', 'newPassword123');
        
            expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser', 'test@gmail.com']);
        });
    });
}); 
