import ResourceForm, { type ResourceFormProps } from '@/components/resources/resource-form';
import { getPublisherFields } from '@/components/resources/publisher-fields';

export default function PublisherCreate(props: Omit<ResourceFormProps, 'fields'>) {
    return <ResourceForm {...props} fields={getPublisherFields()} />;
}
