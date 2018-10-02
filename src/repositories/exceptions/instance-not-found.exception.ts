export class InstanceNotFoundException extends Error {
  constructor() {
    super(`Instance not found.`);
  }
}
