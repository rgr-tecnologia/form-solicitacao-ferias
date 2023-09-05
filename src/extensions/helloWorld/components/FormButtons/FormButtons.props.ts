import { FormDisplayMode } from "@microsoft/sp-core-library";

export interface FormButtons {
    displayMode: FormDisplayMode;
    isUserManager: boolean;
    isMemberOfHR: boolean;
    isAuthor: boolean;
    status: string;
    onSave: () => void;
    onClose: () => void;
    onApproveManager: () => void;
    onRejectManager: () => void;
    onApproveHR: () => void;
    onRejectHR: () => void;
}