import ResourceIndex, {
    type ResourceIndexProps,
} from '@/components/resources/resource-index';

export default function AuthorIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return (
        <ResourceIndex
            {...props}
            resource="authors"
        />
    );
}