import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Input, Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';

@Update()
export class AppController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! Friend 👋');
    await ctx.reply('What do you want to do?', actionButtons());
  }

  @Hears('🗒️ Todo list')
  async listTask(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('📝 Create task')
  async createTask(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.reply('Describe task: ');
  }

  @Hears('✅ Complete todo')
  async doneTask(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.reply('Write todo ID: ');
  }

  @Hears('🖋️ Edit list')
  async editList(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.replyWithHTML(
      'Write ID and new name of task: \n\n' + 'In format - <b>1 | New task</b>',
    );
  }

  @Hears('❌ Delete todo')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'remove';
    await ctx.reply('Write todo ID: ');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message));

      if (!todos) {
        await ctx.reply('Todo with this ID is not defined!');
        return;
      }
     await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');

      const todos = await this.appService.editTask(Number(taskId), taskName);

      if (!todos) {
        await ctx.reply('Todo with this ID is not defined!');
        return;
      }
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'remove') {
      const todos = await this.appService.deleteTask(Number(message));

      if (!todos) {
        await ctx.reply('Todo with this ID is not defined!');
        return;
      }

      await ctx.reply(showList(todos.filter((t) => t.id !== Number(message))));
    }
  }
}
