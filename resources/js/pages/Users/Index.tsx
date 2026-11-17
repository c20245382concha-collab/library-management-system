import ResourceIndex, { type ResourceIndexProps } from '@/components/resources/resource-index';

export default function UsersIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return <ResourceIndex {...props} resource="users" />;
}
