import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { FormButtons } from './FormButtons.props';

export function FormButtons(props: FormButtons): JSX.Element {
    const {
        isUserManager,
        isMemberOfHR,
        isAuthor,
        status,
        onSave,
        onClose,
        onApproveManager,
        onRejectManager,
        onApproveHR,
        onRejectHR,
    } = props

    let buttonsElement: JSX.Element

    if(isAuthor && (status === 'Rejected by manager' || status === 'Rejected by HR')) {
        buttonsElement = (
          <>
            <PrimaryButton text='Enviar' onClick={onSave}/>
            <DefaultButton text='Cancelar' onClick={onClose}/>
          </>
        )
    }
    
    else if(isUserManager && status === 'In review by manager') {
        buttonsElement = (
          <>
            <PrimaryButton text='Aprovar' onClick={onApproveManager}/>
            <DefaultButton text='Reprovar' onClick={onRejectManager}/>
          </>
        )
    }

    else if(isMemberOfHR && status === 'In review by HR') {
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