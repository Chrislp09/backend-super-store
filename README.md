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
