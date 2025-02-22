const { Pool } = require('pg');
const db = require('../database');

// Mock pg Pool
jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

describe('Database Module Tests', () => {
    let pool;

    beforeEach(() => {
        pool = new Pool();
        jest.clearAllMocks();
    });

    describe('testConnection', () => {
        it('successfully connects to database', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ now: new Date() }]
            });

            const result = await db.testConnection();
            
            expect(result).toBe(true);
            expect(pool.query).toHaveBeenCalledWith('SELECT NOW()');
        });

        it('handles connection failure', async () => {
            pool.query.mockRejectedValueOnce(new Error('Connection failed'));

            const result = await db.testConnection();
            
            expect(result).toBe(false);
            expect(pool.query).toHaveBeenCalledWith('SELECT NOW()');
        });

        it('handles unexpected database response', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const result = await db.testConnection();
            
            expect(result).toBe(false);  // Expecting a failure due to empty response
            expect(pool.query).toHaveBeenCalledWith('SELECT NOW()');
        });
    });

    describe('query', () => {
        it('executes query successfully', async () => {
            const mockResult = { rows: [{ id: 1, name: 'test' }] };
            pool.query.mockResolvedValueOnce(mockResult);

            const result = await db.query('SELECT * FROM test', []);
            
            expect(result).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM test', []);
        });

        it('handles query errors', async () => {
            pool.query.mockRejectedValueOnce(new Error('Query failed'));

            await expect(db.query('SELECT * FROM test', []))
                .rejects.toThrow('Query failed');
        });

        it('handles invalid SQL syntax', async () => {
            pool.query.mockRejectedValueOnce(new Error('Syntax error in SQL statement'));

            await expect(db.query('INVALID SQL', []))
                .rejects.toThrow('Syntax error in SQL statement');
        });

        it('handles incorrect query parameters', async () => {
            pool.query.mockRejectedValueOnce(new Error('Incorrect query parameters'));

            await expect(db.query('SELECT * FROM users WHERE id = $1', ['stringInsteadOfNumber']))
                .rejects.toThrow('Incorrect query parameters');
        });
    });

    describe('closePool', () => {
        it('successfully closes the connection pool', async () => {
            pool.end.mockResolvedValueOnce();

            await db.closePool();
            
            expect(pool.end).toHaveBeenCalled();
        });

        it('handles errors when closing the connection pool', async () => {
            pool.end.mockRejectedValueOnce(new Error('Pool close error'));

            await expect(db.closePool()).rejects.toThrow('Pool close error');
        });
    });
});
