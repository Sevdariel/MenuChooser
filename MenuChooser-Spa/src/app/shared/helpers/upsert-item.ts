function getByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
  
  export function upsertByPath<T>(
    array: T[],
    newItem: T,
    idPath: string
  ): T[] {
    const newId = getByPath(newItem, idPath);
    const index = array.findIndex(item => getByPath(item, idPath) === newId);
    if (index !== -1) {
      array[index] = newItem;
    } else {
      array.push(newItem);
    }
    return array;
  }