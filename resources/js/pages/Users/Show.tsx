import ResourceShow, { type ResourceShowProps } from '@/components/resources/resource-show';

export default function UserShow(
    props: Omit<ResourceShowProps, 'resource'>,
) {
    return <ResourceShow {...props} resource="users" />;
}
