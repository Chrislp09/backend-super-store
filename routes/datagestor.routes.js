const express = require('express');
const router = express.Router();
const Datagestor = require('../models/datagestor.model');
const xlsx = require('xlsx');

const createResponse = (data, message = null, code = 200) => {
    return { data, message, code };
};

router.post('/', async (req, res) => {
    try {
        // Leer el archivo .xlsx
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = 'Carga_Masiva_Datos'; // Nombre de la hoja en tu archivo
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Guardar los datos en la base de datos
        await Datagestor.create(data);

        // Envía una respuesta con un mensaje de éxito
        res.status(200).json(createResponse(null, 'Datos guardados exitosamente en la base de datos.'));
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        // Envía una respuesta con un mensaje de error
        res.status(500).json(createResponse(null, 'Ocurrió un error al procesar el archivo.', 500));
    }
});

module.exports = router;
