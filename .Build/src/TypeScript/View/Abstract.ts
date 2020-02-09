interface Property {
  name: string;
  values: [][];
  displayMode: number;
  progress?: number;
  type?: number;
}

export interface Item {
  verified: boolean;
  w: number;
  h: number;
  icon: string;
  support: boolean;
  league: string;
  id: string;
  name: string;
  typeLine: string;
  identified: boolean;
  ilvl: number;
  properties: Property[];
  additionalProperties: Property[];
  requirement: Property[];
  secDescrText: string;
  explicitMods: string[];
  descrText: string;
  frameType: number;
  x: number;
  y: number;
  inventoryId: string;
  doublet?: boolean;
  element?: HTMLElement;
}

export interface Tab {
  n: string;
  i: number;
  id: string;
  type: string;
  hidden: boolean;
  selected: boolean;
  colour: {r: number, g: number, b: number};
  srcL: string;
  srcC: string;
  srcR: string;
  element?: HTMLElement;
}

export interface StashItems {
  numTabs: number;
  items?: Item[];
  tabs?: Tab[];
}

export class Abstract {
  attachEvent(element: HTMLElement, event: string, callback: EventListener) {
    element.addEventListener(event, callback);
  }

  getSpan(text: string, cssClass: string): HTMLElement {
    let element = document.createElement('span');
    element.innerText = text;
    element.classList.add(cssClass);
    return element;
  }
}
