import type { Field, FieldOption } from '@/components/resources/resource-form';

export function getAuthorProfileFields(authors: FieldOption[]): Field[] {
    return [
        {
            name: 'author_id',
            label: 'Author',
            type: 'select',
            required: true,
            options: authors,
        },
        {
            name: 'bio',
            label: 'Biography',
            type: 'textarea',
        },
    ];
}