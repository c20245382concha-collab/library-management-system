import type { Field } from '@/components/resources/resource-form';

export function getAuthorFields(): Field[] {
    return [
        {
            name: 'name',
            label: 'Name',
            required: true,
        },
        {
            name: 'bio',
            label: 'Biography',
            type: 'textarea',
        },
    ];
}