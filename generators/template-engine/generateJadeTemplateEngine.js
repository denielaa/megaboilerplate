import { join } from 'path';
import { copy, replaceCode, addDependencies } from '../utils';
import dependencies from '../../modules/dependencies';

async function generateJadeTemplateEngine(params) {
  let app;
  let viewEngineSetup;
  let baseRoute;

  switch (params.framework) {
    case 'express':
      app = join(__base, 'build', params.uuid, 'app.js');
      viewEngineSetup = join(__base, 'modules', 'template-engine', 'jade', 'jade-express.js');
      baseRoute = join(__base, 'modules', 'template-engine', 'jade', 'express-route.js');

      // Set "views dir" and "view engine"
      await replaceCode(app, 'TEMPLATE_ENGINE', viewEngineSetup, { leadingBlankLine: true });

      // Set base route "/"
      await replaceCode(app, 'BASE_ROUTE', baseRoute, { leadingBlankLine: true });

      // Add Jade to package.json
      await addDependencies(dependencies.templateEngine.expressJade, params);

      // Copy initial Jade templates to "views" directory
      await copy(
        join(__base, 'modules', 'template-engine', 'jade', 'views'),
        join(__base, 'build', params.uuid, 'views')
      );
      break;
    case 'hapi':
      app = join(__base, 'build', params.uuid, 'app.js');
      viewEngineSetup = join(__base, 'modules', 'template-engine', 'jade', 'jade-hapi.js');

      // Register view engine
      await replaceCode(app, 'TEMPLATE_ENGINE', viewEngineSetup, { leadingBlankLine: true });

      // Add dependencies
      await addDependencies(dependencies.templateEngine.hapiJade, params);

      // Copy initial Jade templates to "views" directory
      await copy(
        join(__base, 'modules', 'template-engine', 'jade', 'views'),
        join(__base, 'build', params.uuid, 'views')
      );
      break;
    case 'meteor':
      break;
    default:
  }
}

export default generateJadeTemplateEngine;
