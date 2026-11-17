import ResourceForm, { type ResourceFormProps, type FieldOption } from '@/components/resources/resource-form';
import { getBookFields } from '@/components/resources/book-fields';

interface BookEditProps extends Omit<ResourceFormProps, 'fields'> {
    authors: FieldOption[];
    publishers: FieldOption[];
    genres: FieldOption[];
}

export default function BookEdit(props: BookEditProps) {
    const fields = getBookFields(props);

    return <ResourceForm {...props} fields={fields} />;
}