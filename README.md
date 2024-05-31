# Prueba Test

## Configuración

El archivo de configuración se encuentra en `config/config.js`, donde se especifican las diferentes configuraciones según el entorno.

```javascript
const config = {
    env: "dev",
    dev: {
        apiRoot: process.env.MONGODB_URI_SUPERSTORE // Apunta a la base de datos en la nube MongoDB con la data del archivo CSV proporcionado.
    },
    test: {
        apiRoot: process.env.MONGODB_URI_TEST // Apunta a la base de datos de prueba en la nube MongoDB.
    },
    local: {
        apiRoot: process.env.MONGO_URI_LOCAL // Apunta a la base de datos local.
    },
};

module.exports = config;
```
En este archivo, se especifica que el entorno de "dev" utiliza la base de datos en la nube MongoDB con la data del archivo CSV proporcionado, mientras que el entorno de "test" utiliza una base de datos de prueba en la nube MongoDB.

## Ejecución del Proyecto
Para correr el proyecto, sigue los siguientes pasos:

Ejecuta npm install para instalar las dependencias del proyecto.
Luego, ejecuta el proyecto con el comando node app.js.

Versiones Utilizadas

Node.js: v20.5.1

npm: v9.8.0

### Endpoint de Prueba

El backend se encuentra publicado en el siguiente URL: 

Endpoint de prueba: [http://ec2-3-15-139-181.us-east-2.compute.amazonaws.com/api/gestor/count]()
