export enum TreeNodeType {
  USER = 'user',
}

export type UserNode = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: TreeNodeType.USER;
};

export type TreeNode = UserNode;

export type SelectedUser = {
  id: string;
  type: TreeNodeType.USER;
};

export type SelectedMember = SelectedUser;

export interface SelectedUserWithData extends SelectedUser {
  data: UserNode;
}

export type SelectedMemberWithData = SelectedUserWithData;
