import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📝 Create task', 'create'),
      Markup.button.callback('🗒️ Todo list', 'list'),
      Markup.button.callback('✅ Complete todo', 'list'),
      Markup.button.callback('🖋️ Edit list', 'edit'),
      Markup.button.callback('❌ Delete todo', 'delete'),
    ],
    {
      columns: 1,
    },
  );
}
