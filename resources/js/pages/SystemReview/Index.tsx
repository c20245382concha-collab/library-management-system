import ResourceIndex, {
    type ResourceIndexProps,
} from '@/components/resources/resource-index';

interface Props {
    reviews: ResourceIndexProps['items'];
    averageRating: number;
    totalReviews: number;
    filters?: ResourceIndexProps['filters'];
    canManage?: boolean;
}

export default function Index({
    reviews,
    averageRating,
    totalReviews,
    filters,
    canManage = true,
}: Props) {
    return (
        <ResourceIndex
            title="System Reviews"
            description="Browse feedback and ratings submitted by library users."
            resource="system-reviews"
            items={reviews}
            filters={filters}
            canManage={canManage}
            canCreate={true}
            canShow={false}
            canEdit={false}
            averageRating={averageRating}
            totalReviews={totalReviews}
            columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'rating', label: 'Rating' },
                { key: 'feedback', label: 'Feedback' },
            ]}
        />
    );
}