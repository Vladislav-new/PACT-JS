/*
 * Общий ESLint конфиг для монорепо (consumer, provider).
 * Цели:
 *  - Единый стиль имён (Clean Code): переменные/функции — camelCase, типы/классы — PascalCase, константы — UPPER_CASE
 *  - Без неиспользуемых переменных/импортов
 *  - Явные и безопасные конструкции (eqeqeq, curly, no-var)
 *  - Упорядоченные импорты для читабельности
 */

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      // Указываем tsconfig для строгой типизации правил
      './tsconfig.base.json',
      './consumer/tsconfig.json',
      './provider/tsconfig.json'
    ]
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier' // Отключает конфликтующие правила форматирования, если используется Prettier
  ],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.spec.ts', '**/test/**/*.ts'],
      env: { jest: true }, // Включает глобалы Jest в тестах
      rules: {
        // Тесты часто взаимодействуют с мок-объектами, где строгая типизация мешает
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off'
      }
    }
  ],
  rules: {
    // Именование: переменные/функции — camelCase; типы/классы/enum — PascalCase; константы — UPPER_CASE
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'default', format: ['camelCase'] },
      { selector: ['class', 'interface', 'typeAlias', 'enum', 'typeParameter'], format: ['PascalCase'] },
      { selector: 'variable', modifiers: ['const'], format: ['camelCase', 'UPPER_CASE'] }
    ],

    // Неиспользуемые переменные — ошибка (игнорируем '_' как префикс для намеренно неиспользуемых)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // Всегда строгое сравнение
    eqeqeq: ['error', 'always'],
    // Всегда использовать фигурные скобки
    curly: ['error', 'all'],
    // Запрещаем var
    'no-var': 'error',

    // Последовательный порядок импортов: внешние → внутренние, группы по типам
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

    // Снижаем шум: явный тип возврата не требуем для простых функций
    '@typescript-eslint/explicit-function-return-type': 'off',
    // Разрешаем non-null assertion только при необходимости
    '@typescript-eslint/no-non-null-assertion': 'warn'
  }
};
