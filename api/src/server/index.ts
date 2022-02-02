/*
 *  Sets up fastify API server.
 *  Created On 30 January 2022
 */

import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from 'itivrutaha/dist/class';
import { AlpaAPIConfig } from '../config/interface';
import chalk from 'chalk';
import jwt from 'fastify-jwt';
import glob from 'glob';
import path from 'path';
import dirname from 'es-dirname';
import cookie from 'fastify-cookie';
import boom from 'fastify-boom';


export interface RouteImpl {
    path: string
    method: string
    opts: any
    getHandler: (config: AlpaAPIConfig) => (req: FastifyRequest, rep: FastifyReply) => Promise<FastifyReply>
}

export let fastify: FastifyInstance

const loadRoutes = async (fastify: FastifyInstance, config: AlpaAPIConfig): Promise<void> => {
    const globStr = path.join(dirname(), 'routes', '**', 'index.js')
    const files = glob.sync(globStr, {
        nodir: true,
        noext: true
    })

    for (const file of files) {
        const { default: route }: { default: RouteImpl } = await import(`file://${file}`)

        route.method = route.method.toLowerCase()
        if (!route.opts) route.opts = {}
        fastify[route.method](route.path, route.opts, route.getHandler(config))
    }
}

export default async (log: Logger, config: AlpaAPIConfig): Promise<void> => new Promise((resolve, reject) => {
    fastify = Fastify({
        // TODO: implement a custom logger, and attach it here
        logger: false
    })

    fastify.register(jwt, {
        secret: config.server.secret,
        cookie: {
            cookieName: 'token',
            signed: true
        }
    })

    fastify.register(cookie, {
        secret: config.server.secret
    })

    fastify.register(boom)

    loadRoutes(fastify, config)
        .then(() => fastify.listen(config.server.port, config.server.host, (err, address) => {
                // log the error and terminate execution
                err && log.error(err, 2)

                // log the success and resolve promise
                log.success(`${chalk.whiteBright.bold('@alpa/api')} listening at ${chalk.gray.underline(`http://${config.server.host}:${config.server.port}`)}`)               
                resolve()
            }))
})
