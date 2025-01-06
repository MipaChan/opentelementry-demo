import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';
import { Context } from '@opentelemetry/api';
import { Trace } from '../common/decorators/trace.decorator';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: 'createTodo' })
  @Trace({
    attributes: (args) => ({
      'todo.title': args[0]?.title,
    }),
  })
  async create(@Payload() createTodoDto: { title: string }, @Ctx() ctx: { context: Context }): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @MessagePattern({ cmd: 'findAllTodos' })
  @Trace()
  async findAll(@Ctx() ctx: { context: Context }): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @MessagePattern({ cmd: 'findOneTodo' })
  @Trace({
    attributes: (args) => ({
      'todo.id': args[0],
    }),
  })
  async findOne(@Payload() id: string, @Ctx() ctx: { context: Context }): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateTodo' })
  @Trace({
    attributes: (args) => ({
      'todo.id': args[0]?.id,
      'todo.update': JSON.stringify(args[0]?.updateTodoDto),
    }),
  })
  async update(@Payload() data: { id: string; updateTodoDto: { title?: string; completed?: boolean } }, @Ctx() ctx: { context: Context }): Promise<Todo> {
    return this.todoService.update(data.id, data.updateTodoDto);
  }

  @MessagePattern({ cmd: 'removeTodo' })
  @Trace({
    attributes: (args) => ({
      'todo.id': args[0],
    }),
  })
  async remove(@Payload() id: string, @Ctx() ctx: { context: Context }): Promise<Todo> {
    return this.todoService.remove(id);
  }
}
