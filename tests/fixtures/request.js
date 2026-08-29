import { USER } from './user';

export const CREATE_USER_REQUEST = {
    email: USER.email,
    firstName: USER.firstName,
    lastName: USER.lastName
};

export const UPDATE_USER_REQUEST = {
    id: USER.id,
    email: USER.email,
    firstName: USER.firstName,
    lastName: USER.lastName,
    roles: USER.roles,
    createdAt: USER.createdAt,
    updatedAt: USER.updatedAt
};
