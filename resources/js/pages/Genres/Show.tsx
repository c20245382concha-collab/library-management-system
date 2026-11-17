import ResourceShow, { type ResourceShowProps } from '@/components/resources/resource-show';

export default function GenreShow(
    props: Omit<ResourceShowProps, 'resource'>,
) {
    return <ResourceShow {...props} resource="genres" />;
}
