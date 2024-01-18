export function flattenObject(obj: any): Record<string, unknown> {
  const result: Record<string, any> = {};
  function recurse(current: any, path: string[] = []) {
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const newPath = path.concat([key]);
        if (typeof current[key] === 'object' && !Array.isArray(current[key])) {
          recurse(current[key], newPath);
        } else {
          result[newPath.join('.')] = current[key];
        }
      }
    }
  }

  recurse(obj);

  return result;
}

export function unflattenObject(
  obj: Record<string, any>
): Record<string, any> {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keys = key.split('.');
      let currentLevel = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!currentLevel[keys[i]]) {
          currentLevel[keys[i]] = {};
        }
        currentLevel = currentLevel[keys[i]];
      }
      currentLevel[keys[keys.length - 1]] = obj[key];
    }
  }

  return result;
}

export default function updateObject<T extends Record<string, unknown>>(
  originalObject: T, updates: Partial<T>
): T {
  const updatedObject: T = { ...originalObject }
  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      const updatedValue = updates[key];

      if (typeof updatedValue === 'object' && !Array.isArray(updatedValue)) {
        const flattenedOriginal = flattenObject((updatedObject as any)[key]);
        const flattenedUpdated = flattenObject(updatedValue);
        const mergedObject = {
          ...flattenedOriginal,
          ...flattenedUpdated
        };
        (updatedObject as any)[key] = unflattenObject(mergedObject);
      } else {
        (updatedObject as any)[key] = updatedValue;
      }
    }
  }

  return updatedObject;
}

