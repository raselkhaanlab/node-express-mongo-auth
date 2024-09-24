import YAML from 'yamljs'; // To load YAML files
import swaggerUi from 'swagger-ui-express';
import { env } from './env.js';

// Load the Swagger YAML file
const loadedSpec = YAML.load("../swagger/index.yaml");

const swaggerSpec = {...loadedSpec, servers:[
   {
    url: env("DNS_ADDRESS") + "/v1"
   }
]}

export { swaggerSpec, swaggerUi };
