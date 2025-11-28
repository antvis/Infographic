export interface Command {
  apply(): Promise<void>;
  undo(): Promise<void>;
  serialize(): any;
}
