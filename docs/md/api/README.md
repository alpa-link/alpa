---
layout: ../README.md
---

## ⚙️ Configuration

Refer to the [config example file](https://github.com/vsnthdev/alpa/blob/main/api/config.example.yml) for all possible configuration keys, and their detailed explanation. If you still have any doubts, feel free to shoot a tweet at me [@vsnthdev](https://vas.cx/@me).

## 🔭 API Routes

| Method | Path | Description | Protected |
|---|---|---|---|
{{#each api.routes}}
| `{{this.method}}` | `{{this.path}}` | {{this.description}} | {{#if this.authRequired}}✅{{else}}❌{{/if}} |
{{/each}}

## 🔮 Tech stack

## 🧭 `npm` scripts
