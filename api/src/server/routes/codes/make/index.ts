import { FastifyReply, FastifyRequest } from 'fastify';
import { AlpaAPIConfig } from '../../../../config/interface.js';
import { ConnectionsList } from '../../../../database.js';
import auth from '../../../plugins/auth.js';
import boom from 'boom';

export interface CodeLink {
    title: string
    icon: string
    image: string
    url: string
}

export interface Code {
    code: string
    tags: string[]
    links: CodeLink[]
}

const getHandler = (config: AlpaAPIConfig, db: ConnectionsList) => async (req: FastifyRequest, rep: FastifyReply): Promise<any> => {
    const body = req.body as Code
    const code = body.code
    delete body.code

    const exists = await db.codes.exists(code)
    if (exists && Boolean(req.query['force']) == false) throw boom.conflict('That code already exists')

    await db.codes.set(code, JSON.stringify(body))

    if (exists) {
        return rep.status(200).send({
            message: 'Updated the code'
        })
    } else {
        return rep.status(201).send({
            message: 'Created a new code'
        })
    }
}

export default {
    path: '/api/codes',
    method: 'POST',
    opts: {
        preValidation: [auth]
    },
    getHandler,
}
