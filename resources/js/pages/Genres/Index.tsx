import ResourceIndex, { type ResourceIndexProps } from '@/components/resources/resource-index';

export default function GenresIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return <ResourceIndex {...props} resource="genres" />;
}
