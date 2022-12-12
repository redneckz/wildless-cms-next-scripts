# Унифицированные блоки для сайтов под управлением Wildless CMS

Набор _core блоков_ для построения сайтов.

_Блок_ - это композиция компонентов UI Kit и (опционально) интеграция с API. Блок по своей сути ближе к понятию _микрофронта_.
_Блоки_ совместимы и с `React` и c `Vue3` благодаря слою совместимости [Uni JSX](https://github.com/redneckz/uni-jsx/).

> Именно потому импорты из фреймворков недопустимы на уровне блоков.

На низком уровне _блок_ - это совокупность следующего:

- [JSX](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#typescript)
- Стилизация на [Tailwind CSS](https://tailwindcss.com/)
- (опционально) Логика на псевдо-хуках (`context.useState(...)` или `context.useAsyncData(...)`)

## Установка пакетов

Требуется Node.js v16 или выше. Для управления версиями Node.js рекомендуется использовать https://github.com/nvm-sh/nvm

```
$ npm i --force
```

## Запуск в [React Cosmos](https://github.com/react-cosmos/react-cosmos)

Десктопные блоки http://localhost:5001

```
$ npm start
```

Мобильные блоки http://localhost:5002

```
$ npm run start:mobile
```

## Сборка

TODO

## Прочие скрипты

TODO

[Документация разработчика](./DEVDOC.md)

Запуск автотестов для Visual Regression блоков:

- Базовые скриншоты блоков, с которыми будет производится сравнение, находятся в папке `cypress/snapshots/base`
- При выполнении тестов будут создаваться скриншоты блоков в папках `cypress/snapshots/actual`, `cypress/snapshots/diff` (в том числе по успешно пройденным)
- Тесты по визуальному регрессу запускаются в pipeline при событии push, workflow называется [e2e-visual-regression] 
- Если тест не отработает успешно:
  1. В логах workflow будет название скриншота, на котором найдено расхождение
  2. В Summary workflow будет архив со скриншотами, в том числе в директории diff можно увидеть отличия между компонентами (https://github.com/redneckz/wildless-cms-uni-blocks/blob/main/cosmos-static/snapshotDiff.png)
  
- Обновить snapshots можно в github 
  1. Во вкладке actions необходимо выбрать вкладку e2e-update-snapshots (https://github.com/redneckz/wildless-cms-uni-blocks/blob/main/cosmos-static/readme-snapshots-3.png)
  2. Нажать кнопку `Run workflow` и выбрать ветку, в которой нужно проапдейтить snapshots (https://github.com/redneckz/wildless-cms-uni-blocks/blob/main/cosmos-static/readme-snapshots.png)
  3. Нажать кнопку `Run workflow`, после чего запустится обновление snapshots (https://github.com/redneckz/wildless-cms-uni-blocks/blob/main/cosmos-static/readme-snapshots-2.png)
  4. После успешного обновления snapshots в pull request автоматически запустится проверка e2e-visual-regression / visual-regression (push).

- После скачивания архива в папке `cypress/snapshots/actual` можно посмотреть скриншот с ошибкой теста, в папке `cypress/snapshots/diff` скриншот, на котором выделена разница в изображении
- Если изменения корректны, то необходимо обновить базовые скриншоты - запустить в ручном режиме workflow [e2e-update-snapshots]:
  1. Перед запуском необходимо выбрать свою фича-ветку
  2. Обновленные базовые скриншоты закоммитятся в фича-ветку
