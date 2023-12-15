import express from 'express'

export const router = express.Router()

router.route('/')
  .get()
  .post()

router.route('/:id')
  .get()
  .patch()
  .delete()