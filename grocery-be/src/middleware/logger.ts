import { Request, Response, NextFunction } from 'express'

import chalk from 'chalk'

export const logger = (req: Request, res: Response, next: NextFunction) => {
   const method = req.method
   const path = req.path
   const timestamp = new Date().toISOString()

   // Màu khác nhau cho từng method
   const coloredMethod =
      method === 'GET' ? chalk.green(method) :
         method === 'POST' ? chalk.blue(method) :
            method === 'PUT' ? chalk.yellow(method) :
               method === 'DELETE' ? chalk.red(method) :
                  method

   console.log(`[${chalk.gray(timestamp)}] ${coloredMethod} ${path}`)
   next()
}