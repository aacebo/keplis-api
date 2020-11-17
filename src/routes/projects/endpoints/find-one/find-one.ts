import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { ProjectModel } from '../../project.entity';

export async function findOne(req: Request, res: Response) {
  const project = await ProjectModel.findOne({ name: req.params.projectName })
                                    .populate('createdBy', '_id image username email');

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).send(`Project ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(project.toObject());
}
