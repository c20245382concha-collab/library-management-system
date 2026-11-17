import type { Field, FieldOption } from '@/components/resources/resource-form';

interface BookFieldOptions {
    authors: FieldOption[];
    publishers: FieldOption[];
    genres: FieldOption[];
}

export function getBookFields({
    authors,
    publishers,
    genres,
}: BookFieldOptions): Field[] {
    return [
        {
            name: 'title',
            label: 'Title',
            required: true,
        },
        {
            name: 'author_id',
            label: 'Author',
            type: 'select',
            required: true,
            options: authors,
        },
        {
            name: 'publisher_id',
            label: 'Publisher',
            type: 'select',
            required: true,
            options: publishers,
        },
        {
            name: 'isbn',
            label: 'ISBN',
        },
        {
            name: 'edition',
            label: 'Edition',
        },
        {
            name: 'publication_year',
            label: 'Publication Year',
            type: 'number',
            min: 1000,
            max: new Date().getFullYear(),
        },
        {
            name: 'language',
            label: 'Language',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
        },
        {
            name: 'cover_image',
            label: 'Cover Image URL',
        },
        {
            name: 'total_copies',
            label: 'Total Copies',
            type: 'number',
            required: true,
            min: 1,
        },
        {
            name: 'genre_ids',
            label: 'Genres',
            type: 'multi',
            options: genres,
        },
    ];
}