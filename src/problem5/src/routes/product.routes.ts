import { Router } from 'express';
import * as productController from '../controllers/product.controller';

export const productRouter = Router();

productRouter.post('/', productController.create);
productRouter.get('/', productController.list);
productRouter.get('/:id', productController.getOne);
productRouter.put('/:id', productController.update);
productRouter.delete('/:id', productController.remove);
