import express from 'express'
import PeriflController from '../Controller/PerfilController.ts'
import PerfilDAO from '../DAO/PerfilDAO.ts'
import Database from '../db/db.ts'

const router = express.Router()
let controller = new PeriflController(new PerfilDAO( new Database))

router.get('/', (req,res) => controller.List(req,res))
router.post('/', (req,res) => controller.Create(req,res))
router.put('/', (req,res) => controller.Update(req,res))
router.delete('/:id', (req,res) => controller.Delete(req,res))
router.get('/:id', (req,res) => controller.Read(req,res))

export default router