import type { Field } from '@/components/resources/resource-form';

export function getGenreFields(): Field[] {
    return [
        {
            name: 'genre_name',
            label: 'Genre Name',
            required: true,
        },
    ];
}