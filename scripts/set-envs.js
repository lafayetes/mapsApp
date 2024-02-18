const {writeFileSync, mkdirSync} = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  mapbox_key: "${process.env['MAPBOX_KEY']}",
  otra: "PROPIEDAD",
};
`;
//Esta instruccion es la que crea el directorio si es que no existe y si existe lo reemplaza
mkdirSync('./src/environments',{recursive:true});
//Esta intstruccion crea el archivo
writeFileSync(targetPath , envFileContent);
