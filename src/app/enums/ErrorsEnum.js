const inError = (field, comparison, additionalMsg = '') => {
    const [value, array] = comparison;
    const arrayStr = "'" + JSON.parse(array).join("', '") + "'";
    return `'${value}' is not a valid \`${field}\` value. Accepted ` + 
           `values are: ${arrayStr}.${additionalMsg}`;
};

export const ErrorsEnum = {
    UNKWOUN: field => 'There was an unknown error while trying to validate ' +
                      `the \`${field}\` element.`,
    REQUIRED: field => `The \`${field}\` element is required.`,
    NULLABLE: field => `The \`${field}\` element cannot be null.`,
    OBJ: field => `The \`${field}\` element must contain a valid object.`,
    STR: field => `The \`${field}\` element must contain a valid string.`,
    ARRAY: field => `The \`${field}\` element must contain a valid array.`,
    UNIQUE: field => `The \`${field}\` element must be unique, that is, it ` +
                     'cannot be repeated.',
    NOALNUM: field => `The \`${field}\` element cannot contain alphabetic or ` +
                      'numeric characters.',
    NOPERIOD: field => `The \`${field}\` element cannot contain the period ` +
                       'symbol.',
    NOCOMMA: field => `The \`${field}\` element cannot contain the comma `+
                      'symbol.',
    NOMINUS: field => `The \`${field}\` element cannot contain '-' (negative ` +
                      'sign).',
    STRNUMBER: field => `The \`${field}\` element must contain a valid ` +
                        'string or a valid number.',
    MINLEN: (field, value) => {
        const plural = (value > 1) ? 's' : '';

        return `The \`${field}\` element must contain at least ${value} ` +
               `character${plural}.`;
    },
    LEN: (field, comparison) => `The \`${field}\` element must have a length ` +
                                `of '${comparison[1]}'.`,
    IN: (field, comparison) => inError(field, comparison),
    INLOWER: (field, comparison) => inError(
        field,
        comparison,
        ' The comparison is not case sensitive.'
    ),
    CONTENT: (field) => `The content of the \`${field}\` element did not ` +
                        'pass the validations, please check the ' +
                        'corresponding errors.',
}