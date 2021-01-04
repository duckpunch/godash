// ./node_modules/.bin/jsdoc2md --files src/board.js --template things.hbs --helper templates/helpers.js
var Handlebars = require('handlebars');

Handlebars.registerHelper('kind', (context, kind, options) => {
    return (
        context
        .filter(item => item.kind === kind)
        .map(item => options.fn(item))
        .join('')
    );
});
