
export const successSuffix = text => `${text}_SUCCESS`;
export const errorSuffix = text => `${text}_ERROR`;

export const creator = action => payload => { return { type: action, payload } };