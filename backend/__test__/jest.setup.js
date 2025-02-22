/* This stops the console log errors (which are valid and mean our code is fine) from firing when carrying out tests.
    Ensures our pipelines pass */
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
});