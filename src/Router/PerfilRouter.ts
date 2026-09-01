import express from 'express'
import PeriflController from '../Controller/PerfilController.ts'
import PerfilDAO from '../DAO/PerfilDAO.ts'
import Database from '../db/db.ts'

const router = express.Router()
let controller = new PeriflController(new PerfilDAO( new Database))

router.get('/', controller.List)
router.post('/', controller.Create)
router.put('/', controller.Update)
router.delete('/:id', controller.Delete)
router.get('/:id', controller.Read)