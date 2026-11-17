import type { Field, FieldOption } from '@/components/resources/resource-form';

interface ReviewFieldOptions {
    books: FieldOption[];
}

export function getReviewFields({ books }: ReviewFieldOptions): Field[] {
    return [
        {
            name: 'book_id',
            label: 'Book',
            type: 'select',
            required: true,
            options: books,
        },
        {
            name: 'stars',
            label: 'Rating (1–5)',
            type: 'number',
            required: true,
            min: 1,
            max: 5,
        },
        {
            name: 'comment',
            label: 'Comment',
            type: 'textarea',
        },
    ];
}