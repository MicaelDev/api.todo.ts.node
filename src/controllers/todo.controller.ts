import { Request, Response } from 'express';
import { toASCII } from 'punycode';
import { isForInStatement } from 'typescript';
import { Todo } from '../models/Todo';

export const all = async (req: Request, res: Response) => {
    const list = await Todo.findAll();
    res.json({ list })
}

export const add = async (req: Request, res: Response) => {
    let taskTitle = req.body.title;

    if (taskTitle) {
        const addTask = await Todo.create(
            {
                title: taskTitle, 
                done: req.body.done ? true : false
            });

        res.status(201).json({ taskAdded: addTask });
    }
    else
    {
        res.json({ error: `Tarefa não adicionada ao banco de dados!`});
    }
}

export const update = async (req: Request, res: Response) => {
    const taskId: string = req.params.id;
    let taskToDo = await Todo.findByPk(taskId);

    if (taskToDo) {
        if(req.body.title)
        {
            taskToDo.title = req.body.title;
        }

        if(req.body.done)
        {
            switch (req.body.done.toLowerCase()) {
                case 'true':
                case '1':
                    taskToDo.done = true;
                    break;
                case 'false':
                case '0':
                    taskToDo.done = false;
                    break;
            }
        }
        await taskToDo.save();
        res.json({ taskUpdated: taskToDo });
    }
    else
    {
        res.json({ error: `Tarefa não encontrada no banco de dados!`})
    }
}

export const remove = async (req: Request, res: Response) => {
    let taskId: string = req.params.id;

    let taskToRemove = await Todo.findByPk(taskId);

    if (taskToRemove) {
        await taskToRemove.destroy();
        res.json({ taskRemoved: taskToRemove })
    }
    else
    {
        res.json({ error: `Tarefa não encontrada no banco de dados!`})
    }
}




