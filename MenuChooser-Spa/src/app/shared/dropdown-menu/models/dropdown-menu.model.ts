export interface IDropdownItem {
    name: string;
    linkDestination: string;
    action: () => void;
}

export interface IDropdownSettings {
    iconSrc?: string;
    mainText?: string;
    id: string;
}
