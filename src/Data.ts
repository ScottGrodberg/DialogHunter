export class Data {

    incoming = new Map<string, Set<string>>();  // Connections from values to the key
    outgoing = new Map<string, Set<string>>();  // Connections from the key to values

}