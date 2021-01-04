var Handlebars = require('handlebars');

exports.equal = (arg1, arg2) => arg1 === arg2;
exports.kinds = (docs, kind) => docs.filter(doc => doc.kind === kind);

Handlebars.registerHelper('kind', (context, kind, options) => {
    return (
        context
        .filter(item => item.kind === kind)
        .map(item => options.fn(item))
        .join('\n')
    );
});
