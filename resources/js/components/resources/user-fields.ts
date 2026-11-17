import type { Field, FieldOption } from '@/components/resources/resource-form';

interface UserFieldOptions {
    roles: FieldOption[];
}

export function getUserFields(
    { roles }: UserFieldOptions,
    editing: boolean,
): Field[] {
    return [
        {
            name: 'name',
            label: 'Name',
            required: true,
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
        },
        {
            name: 'role_id',
            label: 'Role',
            type: 'select',
            required: true,
            options: roles,
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: !editing,
        },
        {
            name: 'password_confirmation',
            label: 'Confirm Password',
            type: 'password',
            required: !editing,
        },
    ];
}