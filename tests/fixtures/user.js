export const USER = {
    id: '019ea89c-e194-71b3-b05a-1fd8b0769ec1',
    email: 'anna@example.com',
    firstName: 'Anna',
    lastName: 'Andersson',
    roles: ['12345678-1234-1234-1234-1234567890ab'],
    updatedAt: null,
    createdAt: '2026-07-03T10:30:00+00:00'
};
export const USERS = [
    { ...USER },
    {
        ...USER,
        id: '019ea89c-e194-71b3-b05a-1fd8b0769ec2',
        email: 'kalle@example.com',
        firstName: 'Kalle',
        lastName: 'Kula'
    }
];