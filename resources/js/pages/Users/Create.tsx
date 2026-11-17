import ResourceForm, {
    type FieldOption,
    type ResourceFormProps,
} from '@/components/resources/resource-form';
import { getUserFields } from '@/components/resources/user-fields';

interface UserCreateProps extends Omit<ResourceFormProps, 'fields'> {
    roles: FieldOption[];
}

export default function UserCreate(props: UserCreateProps) {
    return (
        <ResourceForm
            {...props}
            fields={getUserFields({ roles: props.roles }, false)}
        />
    );
}
