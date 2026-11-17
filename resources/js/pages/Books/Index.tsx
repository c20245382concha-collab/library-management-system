import ResourceIndex, { type ResourceIndexProps } from '@/components/resources/resource-index';

export default function BooksIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return <ResourceIndex {...props} resource="books" />;
}
