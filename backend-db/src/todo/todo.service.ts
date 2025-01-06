import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('todo-service');

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(createTodoDto: { title: string }): Promise<Todo> {
    return tracer.startActiveSpan('TodoService.create', async (span) => {
      try {
        span.setAttribute('todo.title', createTodoDto.title);
        const createdTodo = new this.todoModel(createTodoDto);
        const result = await createdTodo.save();
        span.setAttribute('todo.id', result.id);
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findAll(): Promise<Todo[]> {
    return tracer.startActiveSpan('TodoService.findAll', async (span) => {
      try {
        const todos = await this.todoModel.find().exec();
        span.setAttribute('todo.count', todos.length);
        return todos;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findOne(id: string): Promise<Todo> {
    return tracer.startActiveSpan('TodoService.findOne', async (span) => {
      try {
        span.setAttribute('todo.id', id);
        const todo = await this.todoModel.findById(id).exec();
        return todo;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async update(id: string, updateTodoDto: { title?: string; completed?: boolean }): Promise<Todo> {
    return tracer.startActiveSpan('TodoService.update', async (span) => {
      try {
        span.setAttribute('todo.id', id);
        span.setAttribute('todo.update', JSON.stringify(updateTodoDto));
        const todo = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true }).exec();
        return todo;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async remove(id: string): Promise<Todo> {
    return tracer.startActiveSpan('TodoService.remove', async (span) => {
      try {
        span.setAttribute('todo.id', id);
        const todo = await this.todoModel.findByIdAndDelete(id).exec();
        return todo;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
