import type { Field } from '@/components/resources/resource-form';

export function getPublisherFields(): Field[] {
    return [
        {
            name: 'publisher_name',
            label: 'Publisher Name',
            required: true,
        },
    ];
}