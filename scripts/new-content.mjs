import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const LANGUAGES = ['pl', 'en', 'es']
const CONTENT_TYPES = ['project', 'blog']

const [contentType, slug] = process.argv.slice(2)

if (!CONTENT_TYPES.includes(contentType) || !slug) {
	printUsage()
	process.exit(1)
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
	console.error(
		'Slug may contain only lowercase letters, numbers, and single hyphens.'
	)
	process.exit(1)
}

const collection = contentType === 'project' ? 'projects' : 'blog'
const files = LANGUAGES.map(lang => ({
	lang,
	filePath: path.join(
		process.cwd(),
		'src',
		'content',
		collection,
		lang,
		`${slug}.md`
	),
}))

const existingFiles = []

for (const { filePath } of files) {
	try {
		await access(filePath)
		existingFiles.push(filePath)
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error
		}
	}
}

if (existingFiles.length > 0) {
	console.error('Content was not created because these files already exist:')
	existingFiles.forEach(filePath =>
		console.error(`- ${path.relative(process.cwd(), filePath)}`)
	)
	process.exit(1)
}

for (const { lang, filePath } of files) {
	const content =
		contentType === 'project'
			? createProjectTemplate(lang, slug)
			: createBlogTemplate(lang, slug)

	await mkdir(path.dirname(filePath), { recursive: true })
	await writeFile(filePath, content, { encoding: 'utf8', flag: 'wx' })
	console.log(`Created ${path.relative(process.cwd(), filePath)}`)
}

function createProjectTemplate(lang, slug) {
	return `---
title: "TODO: Project title"
subtitle: "TODO: Project subtitle"
metaDescription: "TODO: SEO description"
lang: ${lang}
key: ${slug}
shortDescription: "TODO: Short description for the projects list"
longDescription: |
  TODO: Full project description.

  Add another paragraph here.
slug: ${slug}
image: []
tags: []
---

# TODO: Project title
`
}

function createBlogTemplate(lang, slug) {
	return `---
title: "TODO: Post title"
metaDescription: "TODO: SEO description"
lang: ${lang}
key: ${slug}
description: "TODO: Short description for the blog list"
slug: ${slug}
image: []
tags: []
---

# TODO: Post title

Write the article here.
`
}

function printUsage() {
	console.error(`Usage:
  pnpm new:project <slug>
  pnpm new:blog <slug>

Example:
  pnpm new:project my-new-project`)
}
