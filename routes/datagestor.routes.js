const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const Datagestor = require('../models/datagestor.model');
const CatalogoGenero = require('../models/catalogo.genero.model');
const CatalogoEstatusMarital = require('../models/catalogo.estatus.marital.model');
const CatalogoValidarEdad = require('../models/catalogo.validar.edad.model');

// Crear la carpeta 'uploads' si no existe
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const createResponse = (data, message = null, code = 200) => {
    return { data, message, code };
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

/*SUBIR ARCHIVO XLSX =============================================== */
router.post('/uploadXlsx', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(createResponse(null, 'No se ha subido ningún archivo.', 400));
        }

        const filePath = req.file.path;

        // Leer el archivo subido
        const workbook = xlsx.readFile(filePath);
        const sheetName = 'Carga_Masiva_Datos';
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            return res.status(400).json(createResponse(null, `La hoja "${sheetName}" no se encuentra en el archivo`, 400));
        }

        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // Validar y procesar los datos
        const processedData = [];
        let count = 0;
        for (let i = 1; i < jsonData.length; i++) {
            count++
            const [edad, genero, estado, nombre, apellido] = jsonData[i];
            processedData.push({
                edad_cumplida: edad || '',
                genero: genero || '',
                estado_marital: estado || '',
                nombre: nombre || '',
                apellido: apellido || ''
            });
        }

        await Datagestor.insertMany(processedData);

        res.status(200).json(createResponse({ filePath, recordsSaved: processedData.length }, 'Archivo subido y datos guardados exitosamente'));
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        res.status(500).json(createResponse(null, 'Error al procesar el archivo', 500));
    }
});

/*DEVOLVER LISTA DE DATOS =============================================== */
router.get('/dataList', async (req, res) => {
    try {
        const { limit, page, nombre, apellido, genero, estado_marital, edad_min, edad_max, validar_edad, edad_cumplida } = req.query;

        const requiredParams = ['limit', 'page', 'nombre', 'apellido', 'genero', 'estado_marital', 'edad_min', 'edad_max', 'validar_edad', 'edad_cumplida'];
        const missingParams = requiredParams.filter(param => !(param in req.query));

        if (missingParams.length > 0) {
            return res.status(400).json(createResponse(null, `Falta el parámetro(s) requerido(s): ${missingParams.join(', ')}`, 400));
        }

        const validValoresEdad = ['menor_igual', 'mayor_igual', 'igual', ""];
        if (!validValoresEdad.includes(validar_edad)) {
            return res.status(400).json(createResponse(null, `El valor del parámetro validar_edad es inválido. Debe ser uno de los siguientes valores: ${validValoresEdad.join(', ')}`, 400));
        }

        const query = {};

        if (nombre) query.nombre = { $regex: new RegExp(nombre, 'i') };
        if (apellido) query.apellido = { $regex: new RegExp(apellido, 'i') };
        if (genero) query.genero = genero;
        if (estado_marital) {
            if (estado_marital.includes(',')) {
                const estadosMaritales = estado_marital.split(',').map(estado => estado.trim());
                query.estado_marital = { $in: estadosMaritales };
            } else {
                query.estado_marital = estado_marital;
            }
        }        
        if (edad_min || edad_max) {
            query.edad_cumplida = {};
            if (edad_min) query.edad_cumplida.$gte = Number(edad_min);
            if (edad_max) query.edad_cumplida.$lte = Number(edad_max);
        }

        if (edad_cumplida && validar_edad) {
            let operador;
            switch (validar_edad) {
                case 'menor_igual':
                    operador = { $lte: Number(edad_cumplida) };
                    break;
                case 'mayor_igual':
                    operador = { $gte: Number(edad_cumplida) };
                    break;
                case 'igual':
                    operador = { $eq: Number(edad_cumplida) };
                    break;
                default:
                    operador = {};
                    break;
            }
            query.edad_cumplida = operador;
        }

        // Aplicar paginación
        const skip = (page - 1) * limit;
        const datos = await Datagestor.find(query).skip(skip).limit(limit);
        const total = await Datagestor.countDocuments(query);

        // Devolver los datos filtrados y la información de paginación
        res.status(200).json(createResponse({
            data: datos,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }, 'Datos encontrados'));
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json(createResponse(null, 'No se logró obtener respuesta del servidor', 500));
    }
});

/*SABER CANTIDAD DE REGISTROS EN TABLA =================================*/ 
router.get('/count', async (req, res) => {
    console.log('llego  ================================')
    try {
        const count = await Datagestor.countDocuments();
        res.status(200).json(count); // Solo devolver el número de registros
    } catch (error) {
        console.error('Error al obtener la cantidad de registros:', error);
        res.status(500).json({ error: 'Error al obtener la cantidad de registros' });
    }
});

/*OBTENER LISTADO DE CATALOGOS =============================================*/
router.get('/catalog', async (req, res) => {
    try {
        const { field } = req.query;

        // Validar que el campo sea uno de los permitidos
        if (!field || (field !== 'genero' && field !== 'estado_marital' && field !== 'validacion_edad')) {
            return res.status(400).json(createResponse(null, 'Parámetro de campo incorrecto. Debe ser "genero", "estado_marital" o "validacion_edad"', 400));
        }

        // Definir la colección correspondiente para cada campo
        let collection;
        switch (field) {
            case 'genero':
                collection = await CatalogoGenero.find();
                break;
            case 'estado_marital':
                collection = await CatalogoEstatusMarital.find();
                break;
            case 'validacion_edad':
                collection = await CatalogoValidarEdad.find();
                break;
            default:
                return res.status(400).json(createResponse(null, 'Parámetro de campo incorrecto', 400));
        }

        // Consultar todos los valores en la colección correspondiente
        const allValues = collection;
        
        if (!allValues.length) {
            return res.status(404).json(createResponse(null, 'No se encontraron datos en la colección', 404));
        }

        res.status(200).json(createResponse(allValues, `Lista de valores para el campo "${field}"`, 200));
    } catch (error) {
        console.error('Error al obtener la lista de valores:', error);
        res.status(500).json(createResponse(null, 'Error al obtener la lista de valores', 500));
    }
});


/*GUARDAR REGISTROS ===================================================*/
router.post('/guardarRegistro', async (req, res) => {
    const { genero, edad_cumplida, estado_marital, nombre, apellido } = req.body;
  
    const camposFaltantes = [];
  
    if (!genero) camposFaltantes.push('genero');
    if (!edad_cumplida) camposFaltantes.push('edad_cumplida');
    if (!estado_marital) camposFaltantes.push('estado_marital');
    if (!nombre) camposFaltantes.push('nombre');
    if (!apellido) camposFaltantes.push('apellido');
  
    if (camposFaltantes.length > 0) {
        return res.status(400).json(createResponse(null, `Faltan campos requeridos: ${camposFaltantes.join(', ')}`, 400));
    }
  
    try {
        const nuevoRegistro = new Datagestor({ genero, edad_cumplida, estado_marital, nombre, apellido });
  
        const registroGuardado = await nuevoRegistro.save();
  
        res.status(201).json(createResponse(registroGuardado, 'Registro guardado exitosamente', 201));
    } catch (error) {
        res.status(400).json(createResponse(null, error.message, 400));
    }
});

/*ACTUALIZAR REGISTROS ===============================================*/
router.put('/editarRegistro/:id', async (req, res) => {
    const { genero, edad_cumplida, estado_marital, nombre, apellido } = req.body;
  
    try {
      // Verificar si los datos requeridos están presentes
      const camposFaltantes = [];
      if (!genero) camposFaltantes.push('genero');
      if (!edad_cumplida) camposFaltantes.push('edad_cumplida');
      if (!estado_marital) camposFaltantes.push('estado_marital');
      if (!nombre) camposFaltantes.push('nombre');
      if (!apellido) camposFaltantes.push('apellido');
  
      if (camposFaltantes.length > 0) {
        return res.status(400).json(createResponse(null, `Faltan campos requeridos: ${camposFaltantes.join(', ')}`, 400));
      }
  
      const registro = await Datagestor.findByIdAndUpdate(
        req.params.id,
        { genero, edad_cumplida, estado_marital, nombre, apellido },
        { new: true }
      );
      if (!registro) {
        return res.status(404).json(createResponse(null, 'Registro no encontrado', 404));
      }
      res.json(createResponse(registro, 'Registro actualizado exitosamente'));
    } catch (error) {
      res.status(400).json(createResponse(null, error.message, 400));
    }
  });

/*ELIMINAR REGISTROS =================================================*/
router.delete('/eliminarRegistro/:id', async (req, res) => {
    try {
      const registro = await Datagestor.findByIdAndDelete(req.params.id);
      if (!registro) {
        return res.status(404).json(createResponse(null, 'Registro no encontrado', 404));
      }
      res.json(createResponse(null, 'Registro eliminado correctamente'));
    } catch (error) {
      res.status(500).json(createResponse(null, error.message, 500));
    }
  });

/*OBGENER DATO DE REGISTRO ===========================================*/
router.get('/obtenerRegistro/:id', async (req, res) => {
    try {
      const registro = await Datagestor.findById(req.params.id);
      if (!registro) {
        return res.status(404).json(createResponse(null, 'Registro no encontrado', 404));
      }
      res.json(createResponse(registro, 'Registro encontrado'));
    } catch (error) {
      res.status(500).json(createResponse(null, error.message, 500));
    }
  })

module.exports = router;
