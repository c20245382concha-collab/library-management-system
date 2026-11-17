import ResourceForm, {
    type FieldOption,
    type ResourceFormProps,
} from '@/components/resources/resource-form';
import { getAuthorProfileFields } from '@/components/resources/author-profile-fields';

interface AuthorProfileEditProps extends Omit<ResourceFormProps, 'fields'> {
    authors: FieldOption[];
}

export default function AuthorProfileEdit(props: AuthorProfileEditProps) {
    return (
        <ResourceForm
            {...props}
            fields={getAuthorProfileFields(props.authors)}
        />
    );
}
