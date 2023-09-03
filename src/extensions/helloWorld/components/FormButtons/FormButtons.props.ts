import { FormDisplayMode } from "@microsoft/sp-core-library";

export interface FormButtons {
    displayMode: FormDisplayMode;
    isUserManager: boolean;
    isUserRH: boolean;
    status: string;
    onSave: () => void;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
}