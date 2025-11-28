export const catchAsync = (fn) => {
    return (req, res, next) => {
        // If the promise rejects, catch it and pass it to the global error handler
        fn(req, res, next).catch(next);
    };
};
//# sourceMappingURL=catchAsync.js.map