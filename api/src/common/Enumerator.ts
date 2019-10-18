import _ from 'lodash';

export function enumerateError(error: any) {
  const errorObject = revealAllProperties(error);
  errorObject.stack = getFullErrorStack(error);
  return errorObject;
}

export function revealAllProperties(object: any): any {
  const objectReferences = [];

  do {
    objectReferences.unshift(object);
  } while (object = Object.getPrototypeOf(object));

  const enumeratedObject = {};
  for (const objectReference of objectReferences) {
    Object.getOwnPropertyNames(objectReference).forEach((property) => {
      enumeratedObject[property] = _.cloneDeep(objectReference[property]);
    });
  }

  return enumeratedObject;
}

export function getFullErrorStack(error) {
  let errorString = error.toString();
  if (errorString === '[object Object]') {
    errorString = '';
  }
  let result = error.stack || errorString;
  if (error.cause && typeof (error.cause) === 'function') {
    const errorCause = error.cause();
    if (errorCause) {
      result += `\nCaused by: ${getFullErrorStack(errorCause)}`;
    }
  }
  return result;
}
