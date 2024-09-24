import YAML from 'yamljs'; // To load YAML files
import swaggerUi from 'swagger-ui-express';
import { env } from './env.js';
import path from 'path';
// Load the Swagger YAML file
const swaggerDocPath = path.resolve("../swagger/index.yaml");
const loadedSpec = YAML.load(swaggerDocPath);

const swaggerSpec = {...loadedSpec, servers:[
   {
    url: env("DNS_ADDRESS") + "/v1"
   }
]}

export { swaggerSpec, swaggerUi };
