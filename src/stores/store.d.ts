export type Collapsed = Record<string, string[]>;

export interface ISearchState {
  collapsed: Collapsed;
  search: string;
  pathSelected: string;
}
export interface ITabs extends ISearchState {
  active: boolean;
  name: string;
}
