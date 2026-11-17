import ResourceForm, {
    type FieldOption,
    type ResourceFormProps,
} from '@/components/resources/resource-form';
import { getReviewFields } from '@/components/resources/review-fields';

interface ReviewCreateProps extends Omit<ResourceFormProps, 'fields'> {
    books: FieldOption[];
}

export default function ReviewCreate(props: ReviewCreateProps) {
    return (
        <ResourceForm
            {...props}
            fields={getReviewFields({ books: props.books })}
            indexRoute="books.index"
        />
    );
}
