import ResourceForm, {
    type FieldOption,
    type ResourceFormProps,
} from '@/components/resources/resource-form';
import { getUserFields } from '@/components/resources/user-fields';

interface UserEditProps extends Omit<ResourceFormProps, 'fields'> {
    roles: FieldOption[];
}

export default function UserEdit(props: UserEditProps) {
    return (
        <ResourceForm
            {...props}
            fields={getUserFields({ roles: props.roles }, true)}
        />
    );
}
