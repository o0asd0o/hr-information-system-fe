import { OnboardingFormModalProps } from "..";

export const getInitialValues = ({ selectedDocument }: OnboardingFormModalProps & { isUpdating: boolean }) => {
    return {
        documentName: selectedDocument?.name,
        description: selectedDocument?.description,
    };
}

export const getTouchedValues = (isFieldTouched: (key: string) => boolean, values: any) => {
    return Object.entries(values).reduce((accu, current) => {
        const [key, value] = current;
        if (isFieldTouched(key) && !!key) {
          return { ...accu, [key]: value };
        }
        return { ...accu };
    }, {});
}
