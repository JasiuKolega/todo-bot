export const showList = (todos) =>
  `Your todo list: \n\n${todos
    .map(
      (todo) =>
        todo.id +
        '. ' +
        (todo.isCompleted ? '✅' : '⭕️') +
        ' ' +
        todo.name +
        '\n\n',
    )
    .join('')}`;
