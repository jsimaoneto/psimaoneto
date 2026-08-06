# Arquivos para o repositório raiz (`jsimaoneto.github.io`)

Estes dois arquivos precisam ficar na **raiz do domínio** para os buscadores e
bots de IA os reconhecerem — e não neste projeto (`psimaoneto`), que fica numa
subpasta. Motivo: o Google só lê `robots.txt` e `llms.txt` em
`https://jsimaoneto.github.io/robots.txt`, nunca em `.../psimaoneto/robots.txt`.

## O que fazer

1. Abra (ou crie) o repositório **`jsimaoneto.github.io`** na sua conta do GitHub.
   - Se ainda não existir: crie um repositório público com **exatamente** esse nome.
     Ele é publicado automaticamente em `https://jsimaoneto.github.io/`.
2. Copie para a **raiz** desse repositório:
   - `robots.txt`
   - `llms.txt`
3. Faça o commit e o push.

### Já existe um `robots.txt` na raiz?
Não substitua cegamente — **junte** o conteúdo. O essencial é manter/incluir a
linha do sitemap e não bloquear os bots de IA:

```
Sitemap: https://jsimaoneto.github.io/psimaoneto/sitemap.xml
```

## Depois de publicar — verifique

Acesse no navegador (devem abrir os arquivos, sem erro 404):

- https://jsimaoneto.github.io/robots.txt
- https://jsimaoneto.github.io/llms.txt

## Ainda mais importante (faça também)

1. **Google Search Console** — cadastre o site e envie o sitemap:
   `https://jsimaoneto.github.io/psimaoneto/sitemap.xml`
2. **Perfil da Empresa no Google** (Google Business Profile) do Centro Clínico
   Campolim — o maior fator para aparecer em "psicólogo Sorocaba / Campolim".

> Observação: se um dia você migrar para um **domínio próprio**
> (ex.: `josesimaoneto.com.br`), os arquivos `robots.txt`, `llms.txt` e
> `sitemap.xml` que já estão no projeto `psimaoneto` passam a valer sozinhos,
> na raiz, e esta pasta deixa de ser necessária.
