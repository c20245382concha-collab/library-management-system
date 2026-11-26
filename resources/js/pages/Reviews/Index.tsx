import ResourceIndex, { type ResourceIndexProps } from '@/components/resources/resource-index';

export default function ReviewsIndex(
    props: Omit<ResourceIndexProps, 'resource'>,
) {
    return (
        <ResourceIndex
            {...props}
            resource="reviews"
            canCreate={false}
            canShow={false}
            canEdit={false}
        />
    );
}
