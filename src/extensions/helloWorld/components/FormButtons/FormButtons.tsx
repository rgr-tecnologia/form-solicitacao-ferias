import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { FormDisplayMode } from '@microsoft/sp-core-library';
import { FormButtons } from './FormButtons.props';

export function FormButtons(props: FormButtons): JSX.Element {
    const {
        displayMode,
        isUserManager,
        status,
        onSave,
        onClose,
        onApprove,
        onReject,
    } = props

    let buttonsElement: JSX.Element

    if(displayMode === FormDisplayMode.New) {
        buttonsElement = (
          <>
            <PrimaryButton text='Enviar' onClick={onSave}/>
            <DefaultButton text='Cancelar' onClick={onClose}/>
          </>
        )
    }
    
    else if(isUserManager && status === 'In review') {
        buttonsElement = (
          <>
            <PrimaryButton text='Aprovar' onClick={onApprove}/>
            <DefaultButton text='Reprovar' onClick={onReject}/>
          </>
        )
    }

    return (
        <>
            {buttonsElement}
        </>
    )
}