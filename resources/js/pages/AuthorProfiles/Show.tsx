import ResourceShow, { type ResourceShowProps } from '@/components/resources/resource-show';

export default function AuthorProfileShow(
    props: Omit<ResourceShowProps, 'resource'>,
) {
    return <ResourceShow {...props} resource="author-profiles" />;
}
