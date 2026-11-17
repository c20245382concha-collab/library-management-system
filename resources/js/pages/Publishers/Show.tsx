import ResourceShow, { type ResourceShowProps } from '@/components/resources/resource-show';

export default function PublisherShow(
    props: Omit<ResourceShowProps, 'resource'>,
) {
    return <ResourceShow {...props} resource="publishers" />;
}
