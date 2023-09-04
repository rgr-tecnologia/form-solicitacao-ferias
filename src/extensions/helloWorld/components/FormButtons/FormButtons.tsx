import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { FormDisplayMode } from '@microsoft/sp-core-library';
import { FormButtons } from './FormButtons.props';

export function FormButtons(props: FormButtons): JSX.Element {
    const {
        displayMode,
        isUserManager,
        isMemberOfHR,
        status,
        onSave,
        onClose,
        onApproveManager,
        onRejectManager,
        onApproveHR,
        onRejectHR,
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
    
    else if(isUserManager && status === 'In review manager') {
        buttonsElement = (
          <>
            <PrimaryButton text='Aprovar' onClick={onApproveManager}/>
            <DefaultButton text='Reprovar' onClick={onRejectManager}/>
          </>
        )
    }

    else if(isMemberOfHR && status === 'In review HR') {
      buttonsElement = (
        <>
          <PrimaryButton text='Aprovar' onClick={onApproveHR}/>
          <DefaultButton text='Reprovar' onClick={onRejectHR}/>
        </>
      )
  }

    return (
        <>
            {buttonsElement}
        </>
    )
}