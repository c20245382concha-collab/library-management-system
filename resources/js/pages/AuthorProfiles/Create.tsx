import ResourceForm, {
    type FieldOption,
    type ResourceFormProps,
} from '@/components/resources/resource-form';
import { getAuthorProfileFields } from '@/components/resources/author-profile-fields';

interface AuthorProfileCreateProps extends Omit<ResourceFormProps, 'fields'> {
    authors: FieldOption[];
}

export default function AuthorProfileCreate(props: AuthorProfileCreateProps) {
    return (
        <ResourceForm
            {...props}
            fields={getAuthorProfileFields(props.authors)}
        />
    );
}
