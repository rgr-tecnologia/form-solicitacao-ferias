import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormDisplayMode } from '@microsoft/sp-core-library';

import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

import { IFormSolicitacaoFeriasProps } from './components/FormSolicitacaoFerias/FormSolicitacaoFerias.props';

import {
  SPHttpClient,
} from '@microsoft/sp-http';
import FormSolicitacaoFerias from './components/FormSolicitacaoFerias/FormSolicitacaoFerias';
import { PeriodItem } from './components/PeriodosFeriasList/PeriodosFeriasList.props';

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

interface IListItemResponse extends Omit<IFormSolicitacaoFeriasProps["item"], 'DataInicio' | 'DataFim'> {
  DataInicio: string,
  DataFim: string
}

export default class HelloWorldFormCustomizer
  extends BaseFormCustomizer<IHelloWorldFormCustomizerProperties> {

  // Added for the item to show in the form; use with edit and view form
  private _item: IFormSolicitacaoFeriasProps['item'];

  // Added for item's etag to ensure integrity of the update; used with edit form
  private _etag?: string;

  private secondaryListId: string = 'ff367779-18a9-43f1-8ffc-7237dc66ec80'

  private _allUsersList: {
    internalName: string,
    title: string,
    guid: string
  }

  private _isUserManager: boolean

  private _isMemberOfHR: boolean

  private _userItems: IFormSolicitacaoFeriasProps["item"][];

  private async _getManagerProfile(): Promise<{Id: number}> {    
    const {
      loginName 
    } = this.context.pageContext.user

    const response = await this.context.spHttpClient
      .get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('${this._allUsersList.title}')/items?$filter=LoginName eq '${loginName}'&$top=1`,
        SPHttpClient.configurations.v1, {
        headers: {
          accept: 'application/json;odata.metadata=none'
        }
      })

    const responseJSON = response.ok ? response.json() : Promise.reject(response.statusText)

    const { EMAIL_1ST_EVALUATOR: managerEmail } = (await responseJSON).value.shift()

    const managerProfileResponse = await this.context.spHttpClient
      .get(
        this.context.pageContext.web.absoluteUrl + `/_api/Web/SiteUsers?$filter=UserPrincipalName eq '${managerEmail}'`,
        SPHttpClient.configurations.v1, {
        headers: {
          accept: 'application/json;odata.metadata=none'
        }
      })

    const responseManagerProfile = managerProfileResponse.ok ? managerProfileResponse.json() : Promise.reject(managerProfileResponse.statusText)

    return (await responseManagerProfile).value.shift()
  }

  private _getUserItems(userId: number): Promise<{
    value: IListItemResponse[]
  }> {
    const { guid } = this.context.list;
    
    // load item to display on the form
    return this.context.spHttpClient
      .get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists(guid'${guid}')/items?$filter=AuthorId eq ${userId}&$orderby=ID desc`,
        SPHttpClient.configurations.v1, {
        headers: {
          accept: 'application/json;odata.metadata=none'
        }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          return Promise.reject(res.statusText);
        }
      })
  }

  private _getItemData(): Promise<IListItemResponse> {
    const { guid } = this.context.list;
    
    // load item to display on the form
    return this.context.spHttpClient
      .get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists(guid'${guid}')/items(${this.context.itemId})`,
        SPHttpClient.configurations.v1, {
        headers: {
          accept: 'application/json;odata.metadata=none'
        }
      })
      .then(res => {
        if (res.ok) {
          // store etag in case we'll need to update the item
          this._etag = res.headers.get('ETag');
          return res.json();
        }
        else {
          return Promise.reject(res.statusText);
        }
      })
  }

  private async createOnSecondaryList(data: PeriodItem): Promise<any> {
    const apiUrl = this.context.pageContext.web.absoluteUrl + `/_api/web/lists(guid'${this.secondaryListId}')/items`
  
    try {
      const response = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
        headers: {
          Accept: 'application/json;odata=verbose',
          'Content-Type': 'application/json',
          'odata-version': '',
          'IF-MATCH': '*',
        },
        body: JSON.stringify(data),
      });
  
      if (response.status === 204) {
        return 
      } else {
        const responseJson = await response.json();
        return {
          ...responseJson,
          Tag: responseJson['odata.etag'],
        };
      }
    } catch (error) {
      throw error;
    }
  }

  private async updateOnSecondaryList(data: PeriodItem): Promise<any> {
    const { Id, ...dataToSave } = data;
    const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.secondaryListId}')/items(${Id})`
  
    try {
      const response = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
        headers: {
          Accept: 'application/json;odata=verbose',
          'Content-Type': 'application/json',
          'odata-version': '',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'MERGE',
        },
        body: JSON.stringify({
          ...dataToSave,
        }),
      });
  
      if (response.status === 204) {
        return 
      } else {
        const responseJson = await response.json();
        return {
          ...responseJson,
          Tag: responseJson['odata.etag'],
        };
      }
    } catch (error) {
      throw error;
    }
  }

  private async _createItem(item: IFormSolicitacaoFeriasProps['item']): Promise<IFormSolicitacaoFeriasProps['item']> {
    const { guid } = this.context.list;
    const {
      periods,
      ...itemToSave
    } = item

    const postResponse = await this.context.spHttpClient
      .post(this.context.pageContext.web.absoluteUrl + `/_api/web/lists(guid'${guid}')/items`, 
        SPHttpClient.configurations.v1, {
        headers: {
          'content-type': 'application/json;odata.metadata=none'
        },
        body: JSON.stringify(itemToSave)
      });

    const responseJSON = postResponse.ok ? await postResponse.json() : Promise.reject(postResponse.statusText)

    const secondaryListPostResponse = periods.map(async period => await this.createOnSecondaryList({
      ...period,
      SolicitacaoFeriasId: responseJSON.Id
    }))

    await Promise.all(secondaryListPostResponse)

    

    return responseJSON
    
  }

  private async _updateItem(item: IFormSolicitacaoFeriasProps['item']): Promise<any> {
    const { guid } = this.context.list;
    const {
      periods,
      ...itemToSave
    } = item

    const apiUrl = this.context.pageContext.web.absoluteUrl + `/_api/web/lists(guid'${guid}')/items(${this.context.pageContext.listItem.id})`

    await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
      headers: {
        'content-type': 'application/json;odata.metadata=none',
        'if-match': this._etag,
        'x-http-method': 'MERGE'
      },
      body: JSON.stringify(itemToSave)
    });
    
    await Promise.all(periods.map(async period => this.updateOnSecondaryList(period)))

    return Promise.resolve()
  }

  public async onInit(): Promise<void> {
    this._allUsersList = {
      internalName: 'hierarquia_cjtrade',
      title: 'hierarquia_cjtrade',
      guid: '1733062b-2634-43fc-8207-42fe20b40ac4'   
    }

    try {
      if (this.displayMode === FormDisplayMode.New) {
        
          // we're creating a new item so nothing to load
          const managerProfile = await this._getManagerProfile()

          this._item = {
            Status: 'Draft',
            GestorId: managerProfile.Id,
            Abono: false,
            DecimoTerceioSalario: false,
            Observacao: null,
            QtdDias: null,
            AuthorId: null,
            ObservacaoGestor: null,
            periods: []
          }        

          const userItems = await this._getUserItems(this.context.pageContext.legacyPageContext.userId)
        
          this._userItems = userItems.value.map(item => {
            return {
              ...item,
              DataFim: new Date(item.DataFim),
              DataInicio: new Date(item.DataInicio),
            }
          })

      }
      else {
        const currentItemData = await this._getItemData()

        this._isUserManager = currentItemData.GestorId === this.context.pageContext.legacyPageContext.userId

        this._isMemberOfHR = await this.isMemberOfGroup(139) 

        this._item= {
          ...currentItemData,
        }

        const userItems = await this._getUserItems(currentItemData.AuthorId)

        this._userItems = userItems.value.map(item => {
          return {
            ...item,
            DataFim: new Date(item.DataFim),
            DataInicio: new Date(item.DataInicio),
          }
        })
      }
    }  
    catch(error) {
      throw Error(error)
    }
  }

  private async getCurrentUserGroups(): Promise<any> {
    const queryUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;
    const siteGroupsData = await this.context.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
    const siteGroups = (await siteGroupsData.json()).value;

    return siteGroups
  }

  private async isMemberOfGroup(groupId: number): Promise<boolean> {
    const userGroups = await this.getCurrentUserGroups()
    const group = userGroups.find((group: {Id: number}) => group.Id === groupId)
    return !!group
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const helloWorld: React.ReactElement<{}> =
      React.createElement(FormSolicitacaoFerias, {
        context: this.context,
        displayMode: this.displayMode,
        etag: this._etag,
        item: this._item,
        onSave: this._onSave,
        onClose: this._onClose,
        isUserManager: this._isUserManager,
        isMemberOfHR: this._isMemberOfHR,
        userItems: this._userItems,
        periods: []
       } as IFormSolicitacaoFeriasProps);

    ReactDOM.render(helloWorld, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = async (item: IFormSolicitacaoFeriasProps['item']): Promise<Promise<void>> => {
    if(this.displayMode === FormDisplayMode.New) {
      await this._createItem(item);
    }
    else {
      await this._updateItem(item);
    }

    window.location.reload()
  }

  private _onClose= (): void=> {
    window.location.href = '/sites/newportal'
  }
}
