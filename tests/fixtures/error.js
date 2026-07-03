export const USER_EXISTS_ERROR = {
    statusCode: 409,
    error: {
        type: 'UserExists',
        message: 'Användaren finns redan.'
    }
};

export const USER_NOT_FOUND_ERROR = {
    statusCode: 404,
    error: {
        type: 'UserNotFound',
        message: 'Användaren kunde inte hittas.'
    }
};

export const VALIDATION_ERROR = {
    statusCode: 422,
    error: {
        type: 'ValidationError',
        message: 'Validering misslyckades.',
        details: {
            email: 'Ogiltig e-postadress'
        }
    }
};
