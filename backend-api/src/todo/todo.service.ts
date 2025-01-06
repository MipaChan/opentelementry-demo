import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { trace, context } from '@opentelemetry/api';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TodoService {
  private readonly tracer = trace.getTracer('todo-api-service');

  constructor(
    @Inject('TODO_SERVICE') private readonly todoClient: ClientProxy,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const span = this.tracer.startSpan('TodoService.create');
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        span.setAttribute('todo.title', createTodoDto.title);
        const result = await firstValueFrom(
          this.todoClient.send({ cmd: 'createTodo' }, createTodoDto)
        );
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findAll() {
    const span = this.tracer.startSpan('TodoService.findAll');
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const result = await firstValueFrom(
          this.todoClient.send({ cmd: 'findAllTodos' }, {})
        );
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findOne(id: string) {
    const span = this.tracer.startSpan('TodoService.findOne');
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        span.setAttribute('todo.id', id);
        const result = await firstValueFrom(
          this.todoClient.send({ cmd: 'findOneTodo' }, id)
        );
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const span = this.tracer.startSpan('TodoService.update');
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        span.setAttribute('todo.id', id);
        span.setAttribute('todo.update', JSON.stringify(updateTodoDto));
        const result = await firstValueFrom(
          this.todoClient.send({ cmd: 'updateTodo' }, { id, updateTodoDto })
        );
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async remove(id: string) {
    const span = this.tracer.startSpan('TodoService.remove');
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        span.setAttribute('todo.id', id);
        const result = await firstValueFrom(
          this.todoClient.send({ cmd: 'removeTodo' }, id)
        );
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
