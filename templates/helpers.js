// ./node_modules/.bin/jsdoc2md --files src/board.js --template things.hbs --helper templates/helpers.js
var Handlebars = require('handlebars');

Handlebars.registerHelper('kind', (context, kind, module, options) => {
    return (
        context
        .filter(item => item.kind === kind)
        .filter(item => item.memberof === module)
        .map(item => options.fn(item))
        .join('')
    );
});

Handlebars.registerHelper(
    'renderParams',
    params => params && params.map(param => param.name).join(', '),
);

Handlebars.registerHelper(
    'indentRest',
    (content, spaces) => {
        var lines = content.split('\n');
        var indent = Array(spaces + 1).join(' ');
        return lines[0] + '\n' + lines.slice(1).map(line => indent + line).join('\n');
    },
);
