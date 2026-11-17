import ResourceForm, { type ResourceFormProps } from '@/components/resources/resource-form';
import { getAuthorFields } from '@/components/resources/author-fields';

export default function AuthorCreate(props: Omit<ResourceFormProps, 'fields'>) {
    return <ResourceForm {...props} fields={getAuthorFields()} />;
}
