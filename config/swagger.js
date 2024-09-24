import YAML from 'yamljs'; // To load YAML files
import swaggerUi from 'swagger-ui-express';
import { env } from './env.js';
import path from 'path';
import { fileURLToPath } from 'url';
// Get the file path of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = path.dirname(__filename);
// Load the Swagger YAML file
const swaggerDocPath = path.resolve(__dirname,"../swagger/index.yaml");
const loadedSpec = YAML.load(swaggerDocPath);

const swaggerSpec = {...loadedSpec, servers:[
   {
    url: env("DNS_ADDRESS") + "/v1"
   }
]}

export { swaggerSpec, swaggerUi };
