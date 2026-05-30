# Changesets

Этот проект использует [changesets](https://github.com/changesets/changesets) для release management.

## Workflow

1. После каждого изменения в пакете запускай `pnpm changeset`
2. Выбери пакет(ы) которые изменились
3. Укажи тип версии: `major` / `minor` / `patch`
4. Опиши изменение (по-русски или English — на твоё усмотрение)
5. Закоммить changeset файл вместе с кодом

CI автоматически:
- Открывает "Version Packages" PR при merge в main
- После merge в main — публикует пакеты в npm

## Conventional commit format

```
feat(button): add loading state with Spinner
fix(tokens): correct dark theme surface color
docs(storybook): update Button story examples
chore: update tsup to 8.x
```

Типы: `feat` / `fix` / `docs` / `chore` / `refactor` / `test` / `perf` / `build`
