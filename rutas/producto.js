const router = require('express').Router()

const {
    getProductos,
    getProducto,
    getMotorHbsProductos,
    getMotorPugProductos,
    getMotorEjsProductos,
    postProducto,
    postFormProducto,
    putProducto,
    deleteProducto
}=require('../controlador/producto')

     /* console.log('Dentro Rutas de producto')
     console.log(__dirname) */


router.get('/',              getProductos)
router.get('/motorHbs',      getMotorHbsProductos)
router.get('/motorPug',      getMotorPugProductos)
router.get('/motorEjs',      getMotorEjsProductos)
router.get('/:id',           getProducto)
router.post('/',             postProducto)
router.post('/form',         postFormProducto)
router.put('/:id',           putProducto)
router.delete('/:id',        deleteProducto)


module.exports=router