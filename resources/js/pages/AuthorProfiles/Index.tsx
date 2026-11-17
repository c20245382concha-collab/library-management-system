import ResourceIndex, { type ResourceIndexProps } from '@/components/resources/resource-index';

export default function AuthorProfilesIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return <ResourceIndex
        {...props}
        resource="author-profiles"
    />;
}
