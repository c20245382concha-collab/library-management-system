import ResourceForm, { type ResourceFormProps } from '@/components/resources/resource-form';
import { getGenreFields } from '@/components/resources/genre-fields';

export default function GenreCreate(props: Omit<ResourceFormProps, 'fields'>) {
    return <ResourceForm {...props} fields={getGenreFields()} />;
}
