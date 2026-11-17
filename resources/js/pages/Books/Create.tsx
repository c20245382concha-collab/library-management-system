import ResourceForm, { type ResourceFormProps, type FieldOption } from '@/components/resources/resource-form';
import { getBookFields } from '@/components/resources/book-fields';

interface BookCreateProps extends Omit<ResourceFormProps, 'fields'> {
    authors: FieldOption[];
    publishers: FieldOption[];
    genres: FieldOption[];
}

export default function BookCreate(props: BookCreateProps) {
    const fields = getBookFields(props);

    return <ResourceForm {...props} fields={fields} />;
}