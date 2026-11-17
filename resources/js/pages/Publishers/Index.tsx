import ResourceIndex, { type ResourceIndexProps } from '@/components/resources/resource-index';

export default function PublishersIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return <ResourceIndex {...props} resource="publishers" />;
}
